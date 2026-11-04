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
  // Ya no se bloquea fin de semana acá a mano: depende del horario
  // configurado de cada médico (lunes a viernes, nunca sábado/domingo). Lo
  // filtra SelectorHorario y lo valida el backend.
  fecha: z.string({ error: 'La fecha es obligatoria' }).min(1, 'La fecha es obligatoria'),
  hora: z.string({ error: 'Elegí un horario' }).min(1, 'Elegí un horario'),
  observaciones: z.string().max(500, 'El motivo no puede superar los 500 caracteres').optional(),
})

export type RecepcionFormValues = z.infer<typeof RecepcionSchema>
