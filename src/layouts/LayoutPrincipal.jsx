import { Suspense } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Cargando from '../components/Cargando'

function LayoutPrincipal() {
  const navigate = useNavigate()

  const handleSalir = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      <header className="masthead">
        <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3 py-3">
          <div className="d-flex align-items-center gap-3 text-start">
            <span className="masthead-seal" aria-hidden="true">
              SM
            </span>
            <div>
              <p className="masthead-title mb-0">Salita Municipal N.º 12</p>
              <p className="masthead-subtitle mb-0">Barrio Belgrano · Lun a Vie 8 a 18 hs</p>
            </div>
          </div>
          <nav className="masthead-nav" aria-label="Secciones">
            <NavLink to="/" end>
              Turnos del día
            </NavLink>
            <NavLink to="/pacientes">Pacientes</NavLink>
            <NavLink to="/medicos">Médicos</NavLink>
            <NavLink to="/consultorios">Consultorios</NavLink>
            <NavLink to="/nueva-recepcion">Nueva recepción</NavLink>
            <button type="button" onClick={handleSalir}>
              Salir
            </button>
          </nav>
        </div>
      </header>
      <Suspense fallback={<Cargando />}>
        <Outlet />
      </Suspense>
    </>
  )
}

export default LayoutPrincipal
