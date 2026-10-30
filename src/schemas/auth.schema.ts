import { z } from 'zod'

// "usuario" es genérico a propósito: el personal ingresa su email, y un
// paciente ingresa su DNI (con su teléfono como contraseña).
export const LoginSchema = z.object({
  usuario: z.string({ error: 'El usuario es obligatorio' }).min(1, 'El usuario es obligatorio'),
  password: z.string({ error: 'La contraseña es obligatoria' }).min(1, 'La contraseña es obligatoria'),
})

export type LoginFormValues = z.infer<typeof LoginSchema>

export const OlvidePasswordSchema = z.object({
  email: z.email({ error: 'Ingresá un email válido' }),
})

export type OlvidePasswordFormValues = z.infer<typeof OlvidePasswordSchema>

export const RestablecerPasswordSchema = z
  .object({
    password: z.string({ error: 'La contraseña es obligatoria' }).min(4, 'La contraseña debe tener al menos 4 caracteres'),
    confirmarPassword: z.string({ error: 'Confirmá la contraseña' }).min(1, 'Confirmá la contraseña'),
  })
  .refine((datos) => datos.password === datos.confirmarPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarPassword'],
  })

export type RestablecerPasswordFormValues = z.infer<typeof RestablecerPasswordSchema>
