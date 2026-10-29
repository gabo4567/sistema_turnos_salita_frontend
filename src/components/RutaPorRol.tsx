import { Navigate, Outlet } from 'react-router-dom'

interface RutaPorRolProps {
  rolesPermitidos: string[]
}

// A dónde mandar a alguien que cayó en una ruta que no le corresponde.
// "/home" es la única ruta común a los 4 roles (no vive dentro de ningún
// RutaPorRol), así que no hay riesgo de loop como el que había antes entre
// "/" y "/mis-turnos" para el rol médico.
function RutaPorRol({ rolesPermitidos }: RutaPorRolProps) {
  const rol = localStorage.getItem('rol')
  return rol && rolesPermitidos.includes(rol) ? <Outlet /> : <Navigate to="/home" replace />
}

export default RutaPorRol
