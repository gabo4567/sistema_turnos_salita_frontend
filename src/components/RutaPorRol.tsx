import { Navigate, Outlet } from 'react-router-dom'

interface RutaPorRolProps {
  rolesPermitidos: string[]
}

// La "home" de cada rol: a dónde mandar a alguien que cayó en una ruta que
// no le corresponde. Nunca apunta a una ruta de otro rol (eso fue lo que
// causó el loop de redirecciones entre "/" y "/mis-turnos" para el rol
// médico, antes de que existiera esta función).
function rutaInicioParaRol(rol: string | null): string {
  if (rol === 'paciente') return '/mis-turnos'
  if (rol === 'medico') return '/mis-turnos-medico'
  return '/'
}

function RutaPorRol({ rolesPermitidos }: RutaPorRolProps) {
  const rol = localStorage.getItem('rol')
  return rol && rolesPermitidos.includes(rol) ? <Outlet /> : <Navigate to={rutaInicioParaRol(rol)} replace />
}

export default RutaPorRol
