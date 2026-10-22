import { z } from 'zod'
import { ESPECIALIDADES } from '../constants/turnos'
import type { Especialidad } from '../types/Turno'

const especialidades = ESPECIALIDADES.map((e) => e.valor) as [Especialidad, ...Especialidad[]]

const camposBase = {
  nombre: z.string({ error: 'El nombre es obligatorio' }).min(1, 'El nombre es obligatorio'),
  apellido: z.string({ error: 'El apellido es obligatorio' }).min(1, 'El apellido es obligatorio'),
  especialidades: z
    .array(z.enum(especialidades, { error: 'Especialidad no válida' }))
    .min(1, 'Elegí al menos una especialidad'),
  matricula: z.string({ error: 'La matrícula es obligatoria' }).min(1, 'La matrícula es obligatoria'),
  telefono: z.string().optional(),
  cupoMaximo: z
    .number({ error: 'El cupo máximo debe ser un número' })
    .int('El cupo máximo debe ser un número entero')
    .positive('El cupo máximo debe ser mayor a 0'),
}

// Alta: además de los datos del médico, crea su cuenta de acceso.
export const MedicoSchema = z.object({
  ...camposBase,
  email: z.email({ error: 'El email es obligatorio o no es válido' }),
  password: z.string({ error: 'La contraseña es obligatoria' }).min(4, 'La contraseña debe tener al menos 4 caracteres'),
})

// Edición (admin): no se toca la cuenta de acceso desde esta pantalla.
export const ActualizarMedicoSchema = z.object(camposBase)

export type MedicoFormValues = z.infer<typeof MedicoSchema>
export type ActualizarMedicoFormValues = z.infer<typeof ActualizarMedicoSchema>
