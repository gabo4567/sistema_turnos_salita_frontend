import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { restablecerPassword } from '../api/authApi'
import { extraerMensaje } from '../api/httpClient'
import { RestablecerPasswordSchema, type RestablecerPasswordFormValues } from '../schemas/auth.schema'

function RestablecerPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [error, setError] = useState('')
  const [listo, setListo] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RestablecerPasswordFormValues>({
    resolver: zodResolver(RestablecerPasswordSchema),
    defaultValues: { password: '', confirmarPassword: '' },
  })

  const onSubmit = async (datos: RestablecerPasswordFormValues) => {
    if (!token) return
    setError('')

    try {
      await restablecerPassword(token, datos.password)
      setListo(true)
    } catch (error) {
      setError(extraerMensaje(error))
    }
  }

  return (
    <div className="login-shell">
      <div className="login-marca">
        <span className="masthead-seal login-seal" aria-hidden="true">
          SM
        </span>
        <p className="login-marca-titulo">Salita Municipal N.º 12</p>
        <p className="login-marca-subtitulo">Sistema de gestión de turnos</p>
      </div>

      <div className="login-card">
        <p className="section-label mb-1">Acceso</p>
        <h1 className="mb-4">Elegir nueva contraseña</h1>

        {!token && (
          <div className="alert alert-danger" role="alert">
            Este enlace no es válido.{' '}
            <Link to="/olvide-password" className="alert-link">
              Pedí uno nuevo
            </Link>
            .
          </div>
        )}

        {token && listo && (
          <>
            <div className="alert alert-success" role="status">
              Contraseña actualizada correctamente.
            </div>
            <button type="button" className="btn btn-primary w-100" onClick={() => navigate('/login')}>
              Ir al login
            </button>
          </>
        )}

        {token && !listo && (
          <form onSubmit={handleSubmit(onSubmit)} className="text-start" noValidate>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}{' '}
                <Link to="/olvide-password" className="alert-link">
                  Pedir un enlace nuevo
                </Link>
                .
              </div>
            )}

            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Contraseña nueva
              </label>
              <input
                id="password"
                type="password"
                className={`form-control${errors.password ? ' is-invalid' : ''}`}
                autoFocus
                {...register('password')}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            <div className="mb-4">
              <label className="form-label" htmlFor="confirmarPassword">
                Confirmar contraseña
              </label>
              <input
                id="confirmarPassword"
                type="password"
                className={`form-control${errors.confirmarPassword ? ' is-invalid' : ''}`}
                {...register('confirmarPassword')}
              />
              {errors.confirmarPassword && <div className="invalid-feedback">{errors.confirmarPassword.message}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default RestablecerPasswordPage
