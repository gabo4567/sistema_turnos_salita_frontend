import { NavLink, Outlet } from 'react-router-dom'

function LayoutPrincipal() {
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
            <NavLink to="/nueva-recepcion">Nueva recepción</NavLink>
            <NavLink to="/nuevo-turno">Nuevo turno</NavLink>
            <NavLink to="/nuevo-paciente">Nuevo paciente</NavLink>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  )
}

export default LayoutPrincipal
