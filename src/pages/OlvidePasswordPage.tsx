import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { olvidePassword } from '../api/authApi'
import { extraerMensaje } from '../api/httpClient'
import { OlvidePasswordSchema, type OlvidePasswordFormValues } from '../schemas/auth.schema'

function OlvidePasswordPage() {
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OlvidePasswordFormValues>({
    resolver: zodResolver(OlvidePasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (datos: OlvidePasswordFormValues) => {
    setError('')
    setMensaje('')

    try {
      const respuesta = await olvidePassword(datos.email)
      setMensaje(respuesta)
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
        <h1 className="mb-2">Recuperar contraseña</h1>
        <p className="text-body-secondary small mb-4">
          Solo para personal (administración, recepción o médicos). Si sos paciente, ingresá con tu DNI y tu
          teléfono.
        </p>

        {mensaje ? (
          <>
            <div className="alert alert-success" role="status">
              {mensaje}
            </div>
            <Link to="/login">Volver al login</Link>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="text-start" noValidate>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`form-control${errors.email ? ' is-invalid' : ''}`}
                autoFocus
                {...register('email')}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
            </button>

            <Link to="/login">Volver al login</Link>
          </form>
        )}
      </div>
    </div>
  )
}

export default OlvidePasswordPage
