import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string({ error: 'El email es obligatorio' }).min(1, 'El email es obligatorio'),
  password: z.string({ error: 'La contraseña es obligatoria' }).min(1, 'La contraseña es obligatoria'),
})

export type LoginFormValues = z.infer<typeof LoginSchema>
