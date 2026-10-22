import { z } from 'zod'

// fecha acá valida el valor crudo del <input type="datetime-local">, igual que en turno.schema.ts.
export const HistorialMedicoSchema = z.object({
  fecha: z.string({ error: 'La fecha es obligatoria' }).min(1, 'La fecha es obligatoria'),
  diagnostico: z.string({ error: 'El diagnóstico es obligatorio' }).min(1, 'El diagnóstico es obligatorio'),
  tratamiento: z.string({ error: 'El tratamiento es obligatorio' }).min(1, 'El tratamiento es obligatorio'),
  medico: z.string({ error: 'El médico a cargo es obligatorio' }).min(1, 'El médico a cargo es obligatorio'),
})

export type HistorialMedicoFormValues = z.infer<typeof HistorialMedicoSchema>
