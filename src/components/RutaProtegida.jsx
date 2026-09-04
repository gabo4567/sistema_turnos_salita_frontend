import { Navigate, Outlet } from 'react-router-dom'

function RutaProtegida() {
  const token = localStorage.getItem('token')
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

export default RutaProtegida
