import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import heroSalita from '../assets/hero-salita.svg'
import fotoPacientes from '../assets/cards/pacientes.jpg'
import fotoTurnos from '../assets/cards/turnos.jpg'
import fotoMedicos from '../assets/cards/medicos.jpg'

function IconoCalendarioMas() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
      <path d="M12 14v4M10 16h4" />
    </svg>
  )
}

function IconoCalendarioCheck() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  )
}

function IconoPacientesHome() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <circle cx="18" cy="9" r="2.2" />
      <path d="M16.6 14.3c2.2.5 3.9 2.2 3.9 5.2" />
    </svg>
  )
}

function IconoMedicosHome() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

function IconoConsultoriosHome() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <circle cx="14.5" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconoPersonalHome() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  )
}

interface AccesoHome {
  to: string
  titulo: string
  descripcion: string
  icono: ReactNode
  // Las tarjetas sin foto todavía (se van sumando de a una, generadas con
  // IA) caen en el estilo plano de ícono + fondo blanco.
  imagen?: string
}

// Accesos directos por rol: solo rutas que ya existen en la app (App.tsx),
// no se inventa ninguna ruta nueva acá.
const ACCESOS_PACIENTE: AccesoHome[] = [
  { to: '/pedir-turno', titulo: 'Pedir turno', descripcion: 'Agendá un turno con el especialista que necesites.', icono: <IconoCalendarioMas /> },
  { to: '/mis-turnos', titulo: 'Mis turnos', descripcion: 'Consultá tus próximos turnos y su estado.', icono: <IconoCalendarioCheck /> },
]

const ACCESOS_MEDICO: AccesoHome[] = [
  { to: '/mis-turnos-medico', titulo: 'Mis turnos', descripcion: 'Revisá la agenda del día y llamá a tus pacientes.', icono: <IconoCalendarioCheck /> },
]

const ACCESOS_RECEPCION: AccesoHome[] = [
  { to: '/pacientes', titulo: 'Pacientes', descripcion: 'Buscá, registrá y editá pacientes.', icono: <IconoPacientesHome />, imagen: fotoPacientes },
  { to: '/', titulo: 'Turnos', descripcion: 'Agenda del día: llamá, finalizá o cancelá turnos.', icono: <IconoCalendarioCheck />, imagen: fotoTurnos },
]

const ACCESOS_ADMIN: AccesoHome[] = [
  ...ACCESOS_RECEPCION,
  { to: '/medicos', titulo: 'Médicos', descripcion: 'Gestioná el cuerpo médico y sus especialidades.', icono: <IconoMedicosHome />, imagen: fotoMedicos },
  { to: '/consultorios', titulo: 'Consultorios', descripcion: 'Administrá los consultorios disponibles.', icono: <IconoConsultoriosHome /> },
  { to: '/personal', titulo: 'Personal', descripcion: 'Alta y gestión del personal administrativo y médico.', icono: <IconoPersonalHome /> },
]

function accesosParaRol(rol: string | null): AccesoHome[] {
  if (rol === 'paciente') return ACCESOS_PACIENTE
  if (rol === 'medico') return ACCESOS_MEDICO
  if (rol === 'admin') return ACCESOS_ADMIN
  return ACCESOS_RECEPCION
}

function HomePage() {
  const nombreUsuario = localStorage.getItem('nombreUsuario') || ''
  const rol = localStorage.getItem('rol')
  const accesos = accesosParaRol(rol)

  return (
    <div className="container text-start py-4">
      <div className="home-hero">
        <div className="home-hero-texto">
          <p className="section-label home-hero-saludo mb-1">
            Bienvenido{nombreUsuario && `, ${nombreUsuario}`}
          </p>
          <h1 className="home-hero-titulo">Salita Municipal N.º 12</h1>
          <p className="home-hero-frase">
            Turnos claros, atención cercana: toda la gestión de la salita en un solo lugar.
          </p>
        </div>
        <img
          src={heroSalita}
          alt="Ilustración de la fachada de la Salita Municipal N.º 12"
          className="home-hero-img"
        />
      </div>

      <p className="section-label mb-2">Accesos rápidos</p>
      <div className="home-accesos">
        {accesos.map((acceso) =>
          acceso.imagen ? (
            <Link
              key={acceso.to}
              to={acceso.to}
              className="home-tarjeta home-tarjeta-foto"
              style={{ backgroundImage: `url(${acceso.imagen})` }}
            >
              <span className="home-tarjeta-foto-overlay" aria-hidden="true" />
              <span className="home-tarjeta-foto-contenido">
                <span className="home-tarjeta-icono" aria-hidden="true">
                  {acceso.icono}
                </span>
                <span className="home-tarjeta-titulo">{acceso.titulo}</span>
                <span className="home-tarjeta-desc">{acceso.descripcion}</span>
              </span>
            </Link>
          ) : (
            <Link key={acceso.to} to={acceso.to} className="home-tarjeta">
              <span className="home-tarjeta-icono" aria-hidden="true">
                {acceso.icono}
              </span>
              <span className="home-tarjeta-titulo">{acceso.titulo}</span>
              <span className="home-tarjeta-desc">{acceso.descripcion}</span>
            </Link>
          )
        )}
      </div>
    </div>
  )
}

export default HomePage
