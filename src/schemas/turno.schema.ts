import { z } from 'zod'
import { ESPECIALIDADES } from '../constants/turnos'
import type { Especialidad } from '../types/Turno'

const especialidades = ESPECIALIDADES.map((e) => e.valor) as [Especialidad, ...Especialidad[]]

// fecha y hora se eligen por separado (fecha: <input type="date">, hora:
// un botón de la grilla de disponibilidad) y se combinan recién al armar
// el payload de la petición, ya convertidos a un ISO datetime.
export const TurnoSchema = z.object({
  paciente: z.string({ error: 'El paciente es obligatorio' }).min(1, 'El paciente es obligatorio'),
  especialidad: z.enum(especialidades, { error: 'Especialidad no válida' }),
  medico: z.string({ error: 'El médico es obligatorio' }).min(1, 'El médico es obligatorio'),
  consultorio: z.string().optional(),
  fecha: z.string({ error: 'La fecha es obligatoria' }).min(1, 'La fecha es obligatoria'),
  hora: z.string({ error: 'Elegí un horario' }).min(1, 'Elegí un horario'),
  observaciones: z.string().max(500, 'Las observaciones no pueden superar los 500 caracteres').optional(),
})

export type TurnoFormValues = z.infer<typeof TurnoSchema>

// Para cuando el que pide el turno es el propio paciente logueado: no hay
// selector de paciente (el backend fuerza paciente = quien está logueado,
// ignora cualquier otro id que se mande).
export const PedirTurnoSchema = TurnoSchema.omit({ paciente: true })

export type PedirTurnoFormValues = z.infer<typeof PedirTurnoSchema>
