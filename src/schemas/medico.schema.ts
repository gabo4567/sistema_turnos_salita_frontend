import { z } from 'zod'
import { ESPECIALIDADES } from '../constants/turnos'
import type { Especialidad } from '../types/Turno'

const especialidades = ESPECIALIDADES.map((e) => e.valor) as [Especialidad, ...Especialidad[]]

export const MedicoSchema = z.object({
  nombre: z.string({ error: 'El nombre es obligatorio' }).min(1, 'El nombre es obligatorio'),
  especialidad: z.enum(especialidades, { error: 'Especialidad no válida' }),
  matricula: z.string({ error: 'La matrícula es obligatoria' }).min(1, 'La matrícula es obligatoria'),
  telefono: z.string().optional(),
})

export type MedicoFormValues = z.infer<typeof MedicoSchema>
