import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)

    try {
      const data = await login(email, password)
      if (data.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('nombreUsuario', 'Sofía')
        navigate('/')
      } else {
        setError('Email o contraseña incorrectos')
      }
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setEnviando(false)
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

        <form onSubmit={handleSubmit} className="text-start" noValidate>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={enviando}>
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
