import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getUsuarios, actualizarUsuario } from '../api/usuariosApi'
import { extraerMensaje, extraerMensajesError } from '../api/httpClient'
import { EditarUsuarioSchema, type EditarUsuarioFormValues } from '../schemas/usuario.schema'

function EditarPersonalPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [errores, setErrores] = useState<string[]>([])
  const [guardadoOk, setGuardadoOk] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditarUsuarioFormValues>({
    resolver: zodResolver(EditarUsuarioSchema),
  })

  useEffect(() => {
    if (!id) return
    let cancelado = false

    getUsuarios()
      .then((datos) => {
        if (cancelado) return
        const usuario = datos.find((u) => u.id === id)
        if (!usuario) {
          setErrorCarga('No se encontró el usuario.')
          return
        }
        reset({ nombre: usuario.nombre, email: usuario.email, rol: usuario.rol, password: '' })
      })
      .catch((err) => {
        if (!cancelado) setErrorCarga(extraerMensaje(err))
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [id, reset])

  const onSubmit = async (datos: EditarUsuarioFormValues) => {
    setErrores([])
    setGuardadoOk(false)

    try {
      if (!id) return
      const payload: Partial<EditarUsuarioFormValues> = { ...datos }
      if (!payload.password) delete payload.password
      await actualizarUsuario(id, payload)
      setGuardadoOk(true)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Administración</p>
      <h1 className="mb-2">Editar Usuario</h1>

      {!cargando && !errorCarga && (
        <div className="d-flex gap-3 mb-4">
          <Link to="/personal">Volver a Personal</Link>
        </div>
      )}

      {cargando && <p className="text-body-secondary">Cargando datos del usuario...</p>}

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          {errorCarga}{' '}
          <button
            type="button"
            className="btn btn-link p-0 align-baseline"
            onClick={() => navigate('/personal')}
          >
            Volver al listado
          </button>
        </div>
      )}

      {!cargando && !errorCarga && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {guardadoOk && (
            <div className="alert alert-success" role="alert">
              Cambios guardados correctamente.
            </div>
          )}

          {errores.length > 0 && (
            <div className="alert alert-danger" role="alert">
              <p className="fw-semibold mb-1">No se pudo guardar:</p>
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
                <option value="admin">Administrador</option>
                <option value="recepcionista">Recepcionista</option>
                <option value="medico">Médico</option>
              </select>
              {errors.rol && <div className="invalid-feedback">{errors.rol.message}</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="password">
                Nueva contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Dejar vacío para no cambiarla"
                className={`form-control${errors.password ? ' is-invalid' : ''}`}
                {...register('password')}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      )}
    </div>
  )
}

export default EditarPersonalPage
