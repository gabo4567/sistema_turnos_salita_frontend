import { z } from 'zod'
import { OBRAS_SOCIALES, TIPOS_TELEFONO } from '../constants/pacientes'

const direccionSchema = z.object({
  calle: z.string({ error: 'La calle es obligatoria' }).min(1, 'La calle es obligatoria'),
  numero: z.string({ error: 'El número es obligatorio' }).min(1, 'El número es obligatorio'),
  piso: z.string().optional(),
  departamento: z.string().optional(),
  barrio: z.string().optional(),
})

const telefonoSchema = z.object({
  tipo: z.enum(TIPOS_TELEFONO).optional(),
  codigoArea: z
    .string({ error: 'El código de área es obligatorio' })
    .regex(/^[0-9]{2,5}$/, 'El código de área no es válido'),
  numero: z
    .string({ error: 'El número de teléfono es obligatorio' })
    .regex(/^[0-9]{7,10}$/, 'El número de teléfono no es válido'),
})

const obraSocialSchema = z.object({
  nombre: z.enum(OBRAS_SOCIALES, { error: 'La obra social no es válida' }),
  numeroAfiliado: z.string().optional(),
})

export const PacienteSchema = z.object({
  nombre: z.string({ error: 'El nombre del paciente es obligatorio' }).min(1, 'El nombre del paciente es obligatorio'),
  dni: z.string({ error: 'El DNI del paciente es obligatorio' }).regex(/^[0-9]{7,8}$/, 'El DNI debe tener 7 u 8 dígitos'),
  direccion: direccionSchema,
  email: z.email({ error: 'El correo electrónico es obligatorio o no es válido' }),
  telefono: telefonoSchema,
  obraSocial: obraSocialSchema,
})

export type PacienteFormValues = z.infer<typeof PacienteSchema>
