import { z } from 'zod'
import { ESPECIALIDADES, DIAS_SEMANA } from '../constants/turnos'
import type { Especialidad } from '../types/Turno'
import type { BloqueHorarioMedico } from '../types/Medico'

const especialidades = ESPECIALIDADES.map((e) => e.valor) as [Especialidad, ...Especialidad[]]

// Teléfono obligatorio (lo usa el médico para editar el suyo propio en "Mi perfil").
const telefonoSchema = z.object({
  codigoArea: z
    .string({ error: 'El código de área es obligatorio' })
    .regex(/^[0-9]{2,5}$/, 'El código de área no es válido'),
  numero: z
    .string({ error: 'El número de teléfono es obligatorio' })
    .regex(/^[0-9]{7,10}$/, 'El número de teléfono no es válido'),
})

// Teléfono opcional (alta/edición por admin): como el campo del form
// siempre manda un objeto (nunca "undefined"), dejar los dos vacíos
// también es válido — significa "sin teléfono cargado".
const telefonoOpcionalSchema = z
  .object({
    codigoArea: z.string(),
    numero: z.string(),
  })
  .refine(
    (valor) =>
      (valor.codigoArea === '' && valor.numero === '') ||
      (/^[0-9]{2,5}$/.test(valor.codigoArea) && /^[0-9]{7,10}$/.test(valor.numero)),
    { message: 'Completá código de área y número, o dejá los dos vacíos', path: ['numero'] }
  )

const HORA_REGEX = /^([01]\d|2[0-3]):(00|30)$/

// El formulario siempre manda las 5 filas (lunes a viernes), tildadas o no
// — esta es la validación del formulario "denso". horariosFormAPayload()
// convierte eso al array que espera el backend (solo los días tildados).
const filaHorarioSchema = z
  .object({
    diaSemana: z.number(),
    activo: z.boolean(),
    horaInicio: z.string(),
    horaFin: z.string(),
  })
  .refine(
    (fila) => !fila.activo || (HORA_REGEX.test(fila.horaInicio) && HORA_REGEX.test(fila.horaFin) && fila.horaInicio < fila.horaFin),
    { message: 'Completá un horario válido, o destildá el día', path: ['horaFin'] }
  )

export const horariosFormSchema = z.array(filaHorarioSchema).length(5)

export type FilaHorarioForm = z.infer<typeof filaHorarioSchema>

// Para cargar el form (alta en blanco, o edición con lo que ya tenga el
// médico): siempre las 6 filas, tildando las que vengan en `horarios`.
export function horariosAFormulario(horarios: BloqueHorarioMedico[] | undefined): FilaHorarioForm[] {
  return DIAS_SEMANA.map(({ valor }) => {
    const existente = horarios?.find((b) => b.diaSemana === valor)
    return existente
      ? { diaSemana: valor, activo: true, horaInicio: existente.horaInicio, horaFin: existente.horaFin }
      : { diaSemana: valor, activo: false, horaInicio: '08:00', horaFin: '20:00' }
  })
}

// Al enviar: solo los días tildados, sin el flag `activo` (el backend no lo
// conoce).
export function horariosAPayload(filas: FilaHorarioForm[]): BloqueHorarioMedico[] {
  return filas
    .filter((fila) => fila.activo)
    .map(({ diaSemana, horaInicio, horaFin }) => ({ diaSemana, horaInicio, horaFin }))
}

const camposBase = {
  nombre: z.string({ error: 'El nombre es obligatorio' }).min(1, 'El nombre es obligatorio'),
  apellido: z.string({ error: 'El apellido es obligatorio' }).min(1, 'El apellido es obligatorio'),
  especialidades: z
    .array(z.enum(especialidades, { error: 'Especialidad no válida' }))
    .min(1, 'Elegí al menos una especialidad'),
  matricula: z.string({ error: 'La matrícula es obligatoria' }).min(1, 'La matrícula es obligatoria'),
  telefono: telefonoOpcionalSchema,
  cupoMaximo: z
    .number({ error: 'El cupo máximo debe ser un número' })
    .int('El cupo máximo debe ser un número entero')
    .positive('El cupo máximo debe ser mayor a 0'),
  horarios: horariosFormSchema,
}

// Alta: además de los datos del médico, crea su cuenta de acceso.
export const MedicoSchema = z.object({
  ...camposBase,
  email: z.email({ error: 'El email es obligatorio o no es válido' }),
  password: z.string({ error: 'La contraseña es obligatoria' }).min(4, 'La contraseña debe tener al menos 4 caracteres'),
})

// Edición (admin/recepcionista): también pueden cambiar el email de la
// cuenta de acceso del médico (la contraseña no se toca desde esta pantalla).
export const ActualizarMedicoSchema = z.object({
  ...camposBase,
  email: z.email({ error: 'El email es obligatorio o no es válido' }),
})

// Edición por el propio médico ("Mi perfil"): solo teléfono y horario.
export const ActualizarPerfilPropioMedicoSchema = z.object({
  telefono: telefonoSchema,
  horarios: horariosFormSchema,
})

export type MedicoFormValues = z.infer<typeof MedicoSchema>
export type ActualizarMedicoFormValues = z.infer<typeof ActualizarMedicoSchema>
export type ActualizarPerfilPropioMedicoFormValues = z.infer<typeof ActualizarPerfilPropioMedicoSchema>
