import { z } from 'zod'
import { ESPECIALIDADES } from '../constants/turnos'
import type { Especialidad } from '../types/Turno'

const especialidades = ESPECIALIDADES.map((e) => e.valor) as [Especialidad, ...Especialidad[]]

// fechaTurno acá valida el valor crudo del <input type="datetime-local"> (ej. "2026-10-15T10:00"),
// que NO es un ISO datetime válido todavía — por eso no se espeja z.iso.datetime() del backend.
// La conversión a ISO (new Date(...).toISOString()) se hace recién al armar el payload de la petición.
export const TurnoSchema = z.object({
  paciente: z.string({ error: 'El paciente es obligatorio' }).min(1, 'El paciente es obligatorio'),
  especialidad: z.enum(especialidades, { error: 'Especialidad no válida' }),
  medico: z.string({ error: 'El médico es obligatorio' }).min(1, 'El médico es obligatorio'),
  consultorio: z.string().optional(),
  fechaTurno: z.string({ error: 'La fecha y hora son obligatorias' }).min(1, 'La fecha y hora son obligatorias'),
  observaciones: z.string().max(500, 'Las observaciones no pueden superar los 500 caracteres').optional(),
})

export type TurnoFormValues = z.infer<typeof TurnoSchema>
