import { z } from 'zod'

const roles = ['admin', 'recepcionista'] as const

export const UsuarioSchema = z.object({
  nombre: z.string({ error: 'El nombre es obligatorio' }).min(1, 'El nombre es obligatorio'),
  email: z.string({ error: 'El email es obligatorio' }).email('El email no es válido'),
  password: z.string({ error: 'La contraseña es obligatoria' }).min(4, 'La contraseña debe tener al menos 4 caracteres'),
  rol: z.enum(roles, { error: 'Rol no válido' }),
})

export type UsuarioFormValues = z.infer<typeof UsuarioSchema>

// Para editar: la contraseña es opcional (vacía = no se cambia).
export const EditarUsuarioSchema = UsuarioSchema.extend({
  password: z
    .string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .optional()
    .or(z.literal('')),
})

export type EditarUsuarioFormValues = z.infer<typeof EditarUsuarioSchema>
