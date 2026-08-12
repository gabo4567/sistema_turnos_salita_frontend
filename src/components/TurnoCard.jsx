function TurnoCard({ paciente }) {
  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column align-items-start gap-2">
        <p className="card-title fw-semibold mb-0">{paciente}</p>
        <span className="badge bg-warning text-dark">En Espera</span>
        <button type="button" className="btn btn-primary btn-sm">
          Llamar
        </button>
      </div>
    </div>
  )
}

export default TurnoCard
