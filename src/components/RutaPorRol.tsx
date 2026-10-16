import { Navigate, Outlet } from 'react-router-dom'

interface RutaPorRolProps {
  rolesPermitidos: string[]
  redirigirA?: string
}

function RutaPorRol({ rolesPermitidos, redirigirA = '/' }: RutaPorRolProps) {
  const rol = localStorage.getItem('rol')
  return rol && rolesPermitidos.includes(rol) ? <Outlet /> : <Navigate to={redirigirA} replace />
}

export default RutaPorRol
