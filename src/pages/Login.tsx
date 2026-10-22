import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '../api/authApi'
import { LoginSchema, type LoginFormValues } from '../schemas/auth.schema'

function Login() {
  const [error, setError] = useState('')
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
        navigate('/')
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
            <input
              id="password"
              type="password"
              className={`form-control${errors.password ? ' is-invalid' : ''}`}
              {...register('password')}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
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
