import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearUsuario } from '../api/usuariosApi'
import { extraerMensajesError } from '../api/httpClient'
import { UsuarioSchema, type UsuarioFormValues } from '../schemas/usuario.schema'
import type { Usuario } from '../types/Usuario'

const valoresIniciales: UsuarioFormValues = {
  nombre: '',
  email: '',
  password: '',
  rol: '' as UsuarioFormValues['rol'],
}

function NuevoPersonalPage() {
  const [errores, setErrores] = useState<string[]>([])
  const [usuarioCreado, setUsuarioCreado] = useState<Usuario | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UsuarioFormValues>({
    resolver: zodResolver(UsuarioSchema),
    defaultValues: valoresIniciales,
  })

  const onSubmit = async (datos: UsuarioFormValues) => {
    setErrores([])
    setUsuarioCreado(null)

    try {
      const usuario = await crearUsuario(datos)
      setUsuarioCreado(usuario)
      reset(valoresIniciales)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Administración</p>
      <h1 className="mb-4">Nuevo Usuario</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {usuarioCreado && (
          <div className="alert alert-success" role="alert">
            Usuario <strong>{usuarioCreado.nombre}</strong> agregado exitosamente.
          </div>
        )}

        {errores.length > 0 && (
          <div className="alert alert-danger" role="alert">
            <p className="fw-semibold mb-1">No se pudo crear el usuario:</p>
            <ul className="mb-0 ps-3">
              {errores.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="nombre">
              Nombre completo
            </label>
            <input
              id="nombre"
              className={`form-control${errors.nombre ? ' is-invalid' : ''}`}
              {...register('nombre')}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`form-control${errors.email ? ' is-invalid' : ''}`}
              {...register('email')}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="rol">
              Rol
            </label>
            <select id="rol" className={`form-select${errors.rol ? ' is-invalid' : ''}`} {...register('rol')}>
              <option value="" disabled>
                Seleccioná una opción
              </option>
              <option value="admin">Administrador</option>
              <option value="recepcionista">Recepcionista</option>
            </select>
            {errors.rol && <div className="invalid-feedback">{errors.rol.message}</div>}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className={`form-control${errors.password ? ' is-invalid' : ''}`}
              {...register('password')}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Crear usuario'}
        </button>
      </form>
    </div>
  )
}

export default NuevoPersonalPage
