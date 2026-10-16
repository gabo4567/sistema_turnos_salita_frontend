import { z } from 'zod'

// "usuario" es genérico a propósito: el personal ingresa su email, y un
// paciente ingresa su DNI (con su teléfono como contraseña).
export const LoginSchema = z.object({
  usuario: z.string({ error: 'El usuario es obligatorio' }).min(1, 'El usuario es obligatorio'),
  password: z.string({ error: 'La contraseña es obligatoria' }).min(1, 'La contraseña es obligatoria'),
})

export type LoginFormValues = z.infer<typeof LoginSchema>
