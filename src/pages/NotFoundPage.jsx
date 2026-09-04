import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Error 404</p>
      <h1 className="mb-3">Página no encontrada</h1>
      <p className="text-body-secondary mb-4">La dirección a la que intentaste entrar no existe.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFoundPage
