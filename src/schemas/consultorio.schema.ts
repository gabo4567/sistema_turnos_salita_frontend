import { z } from 'zod'

export const ConsultorioSchema = z.object({
  numero: z.string({ error: 'El número de consultorio es obligatorio' }).min(1, 'El número de consultorio es obligatorio'),
  piso: z.string().optional(),
  especialidad: z.string().optional(),
})

export type ConsultorioFormValues = z.infer<typeof ConsultorioSchema>
