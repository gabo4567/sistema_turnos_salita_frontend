import { z } from 'zod'
import { PacienteSchema } from './paciente.schema'
import { ESPECIALIDADES } from '../constants/turnos'
import type { Especialidad } from '../types/Turno'

const especialidades = ESPECIALIDADES.map((e) => e.valor) as [Especialidad, ...Especialidad[]]

export const RecepcionSchema = z.object({
  datosPaciente: PacienteSchema,
  especialidad: z.enum(especialidades, { error: 'Especialidad no válida' }),
  medico: z.string({ error: 'El médico es obligatorio' }).min(1, 'El médico es obligatorio'),
  consultorio: z.string().optional(),
  fechaTurno: z.string({ error: 'La fecha y hora son obligatorias' }).min(1, 'La fecha y hora son obligatorias'),
  observaciones: z.string().max(500, 'Las observaciones no pueden superar los 500 caracteres').optional(),
})

export type RecepcionFormValues = z.infer<typeof RecepcionSchema>
