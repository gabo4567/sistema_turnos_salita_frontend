import { z } from 'zod'
import { ESPECIALIDADES } from '../constants/turnos'
import { MedicoSchema } from './medico.schema'
import { UsuarioSchema } from './usuario.schema'
import type { Especialidad } from '../types/Turno'

const especialidades = ESPECIALIDADES.map((especialidad) => especialidad.valor) as [
  Especialidad,
  ...Especialidad[],
]

export const NuevoPersonalSchema = z
  .object({
    nombre: z.string(),
    email: z.string(),
    password: z.string(),
    rol: z.enum(['', 'admin', 'recepcionista', 'medico']),
    apellido: z.string(),
    matricula: z.string(),
    especialidades: z.array(z.enum(especialidades)),
    telefono: z.string(),
    cupoMaximo: z.number(),
  })
  .superRefine((datos, contexto) => {
    if (!datos.rol) {
      contexto.addIssue({ code: 'custom', path: ['rol'], message: 'Seleccioná una opción' })
      return
    }

    const resultado =
      datos.rol === 'medico'
        ? MedicoSchema.safeParse(datos)
        : UsuarioSchema.safeParse({
            nombre: datos.nombre,
            email: datos.email,
            password: datos.password,
            rol: datos.rol,
          })

    if (!resultado.success) {
      resultado.error.issues.forEach((issue) => contexto.addIssue({
        code: 'custom',
        path: issue.path,
        message: issue.message,
      }))
    }
  })

export type NuevoPersonalFormValues = z.infer<typeof NuevoPersonalSchema>
