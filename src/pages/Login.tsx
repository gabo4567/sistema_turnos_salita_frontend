import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '../api/authApi'
import { LoginSchema, type LoginFormValues } from '../schemas/auth.schema'

function IconoOjo() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconoOjoTachado() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2" />
      <path d="M6.6 6.6C3.7 8.5 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  )
}

function Login() {
  const [error, setError] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { usuario: '', password: '' },
  })

  const onSubmit = async (datos: LoginFormValues) => {
    setError('')

    try {
      const data = await login(datos.usuario, datos.password)
      if (data.ok && data.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('nombreUsuario', data.nombre ?? 'Administración')
        localStorage.setItem('rol', data.rol ?? '')
        navigate('/home')
      } else {
        setError('Usuario o contraseña incorrectos')
      }
    } catch {
      setError('No se pudo conectar con el servidor')
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
        <h1 className="mb-4">Ingresar</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="text-start" noValidate>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label" htmlFor="usuario">
              Usuario
            </label>
            <input
              id="usuario"
              className={`form-control${errors.usuario ? ' is-invalid' : ''}`}
              placeholder="Email (personal) o DNI (pacientes)"
              autoFocus
              {...register('usuario')}
            />
            {errors.usuario && <div className="invalid-feedback">{errors.usuario.message}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <div className="input-group has-validation">
              <input
                id="password"
                type={mostrarPassword ? 'text' : 'password'}
                className={`form-control${errors.password ? ' is-invalid' : ''}`}
                {...register('password')}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setMostrarPassword((m) => !m)}
                aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                title={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {mostrarPassword ? <IconoOjoTachado /> : <IconoOjo />}
              </button>
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
