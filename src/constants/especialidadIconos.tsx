import type { ReactNode } from 'react'

function IconoCardiologia() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20.5c-5-3.2-9-6.6-9-11A5 5 0 0 1 12 6a5 5 0 0 1 9 3.5c0 4.4-4 7.8-9 11z" />
      <path d="M4.5 12h3l1.5-3 2 5 1.5-3h3.5" />
    </svg>
  )
}

function IconoNeurologia() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3.5c-2.6 0-4.3 1.9-4.3 4-.1 1-.5 1.4-1 1.8-.6.5-1 1.1-1 2 0 1.2.9 1.9 1.9 2-.2.6-.2 1.1 0 1.7.3 1 1.3 1.5 2.3 1.4.1 1.5 1.3 2.6 2.7 2.6" />
      <path d="M9 3.5c1.7 0 3.1.9 3.7 2.2M12.7 5.7c.6-1.3 2-2 3.5-1.7 1.9.4 3.1 2.2 2.7 4.1-.1.6.1 1 .5 1.4.6.6.9 1.4.7 2.2-.2 1.1-1.2 1.7-2.3 1.7.3.6.3 1.2 0 1.8-.4 1-1.5 1.4-2.5 1.2-.3 1.3-1.6 2.3-3 2.1" />
      <path d="M12 6.2v13.6" />
    </svg>
  )
}

function IconoPediatria() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="5" />
      <path d="M9.3 9.3c.5.6 1 .9 1.4.1M14.7 9.3c-.5.6-1 .9-1.4.1" />
      <path d="M9 7c0-.9.7-1.6 1.6-1.6M15 7c0-.9-.7-1.6-1.6-1.6" />
      <path d="M12 14v2M8 21c0-2.8 1.8-5 4-5s4 2.2 4 5" />
    </svg>
  )
}

function IconoDermatologia() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-8 12 12)" />
      <circle cx="9" cy="10.3" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="14.6" cy="12.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconoEspecialidadGenerica() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

// Mapeo único especialidad -> ícono. Las especialidades que no estén acá
// (ninguna hoy, pero por si se agrega una nueva sin actualizar este mapa)
// caen en el ícono genérico.
const ICONOS_POR_ESPECIALIDAD: Record<string, () => ReactNode> = {
  cardiologia: IconoCardiologia,
  neurologia: IconoNeurologia,
  pediatria: IconoPediatria,
  dermatologia: IconoDermatologia,
}

interface IconoEspecialidadProps {
  especialidad: string
}

export function IconoEspecialidad({ especialidad }: IconoEspecialidadProps) {
  const Icono = ICONOS_POR_ESPECIALIDAD[especialidad] ?? IconoEspecialidadGenerica
  return <Icono />
}
