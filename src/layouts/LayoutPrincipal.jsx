import { Suspense, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Cargando from '../components/Cargando'

function IconoTurnos() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
    </svg>
  )
}

function IconoPacientes() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <circle cx="18" cy="9" r="2.2" />
      <path d="M16.6 14.3c2.2.5 3.9 2.2 3.9 5.2" />
    </svg>
  )
}

function IconoMedicos() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

function IconoConsultorios() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <circle cx="14.5" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconoRecepcion() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5 1 0 1.9.2 2.7.5" />
      <path d="M18 8v6M15 11h6" />
    </svg>
  )
}

function IconoColapsar() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  )
}

function IconoSalir() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

const ENLACES = [
  { to: '/', fin: true, etiqueta: 'Turnos del día', icono: <IconoTurnos /> },
  { to: '/pacientes', etiqueta: 'Pacientes', icono: <IconoPacientes /> },
  { to: '/medicos', etiqueta: 'Médicos', icono: <IconoMedicos /> },
  { to: '/consultorios', etiqueta: 'Consultorios', icono: <IconoConsultorios /> },
  { to: '/nueva-recepcion', etiqueta: 'Nueva recepción', icono: <IconoRecepcion /> },
]

function LayoutPrincipal() {
  const navigate = useNavigate()
  const [colapsado, setColapsado] = useState(
    () => localStorage.getItem('sidebarColapsado') === 'true'
  )

  const nombreUsuario = localStorage.getItem('nombreUsuario') || 'Administración'

  const alternarSidebar = () => {
    setColapsado((prev) => {
      const nuevo = !prev
      localStorage.setItem('sidebarColapsado', String(nuevo))
      return nuevo
    })
  }

  const handleSalir = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('nombreUsuario')
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar${colapsado ? ' colapsado' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="masthead-seal" aria-hidden="true">
              SM
            </span>
            <div className="sidebar-brand-texto text-start">
              <p className="masthead-title mb-0">Salita Municipal N.º 12</p>
              <p className="masthead-subtitle mb-0">Barrio Belgrano</p>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-toggle"
            onClick={alternarSidebar}
            aria-label={colapsado ? 'Expandir menú' : 'Colapsar menú'}
          >
            <IconoColapsar />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Secciones">
          {ENLACES.map((enlace) => (
            <NavLink key={enlace.to} to={enlace.to} end={enlace.fin} className="enlace-sidebar">
              {enlace.icono}
              <span className="enlace-etiqueta">{enlace.etiqueta}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="usuario-info">
            <span className="usuario-avatar" aria-hidden="true">
              {nombreUsuario.charAt(0).toUpperCase()}
            </span>
            <span className="usuario-detalle text-start">
              <span className="nombre d-block">{nombreUsuario}</span>
              <span className="rol">Administración</span>
            </span>
          </div>
          <button type="button" className="boton-salir" onClick={handleSalir}>
            <IconoSalir />
            <span className="salir-etiqueta">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Suspense fallback={<Cargando />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

export default LayoutPrincipal
