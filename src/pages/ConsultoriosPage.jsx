import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConsultorioRow from '../components/ConsultorioRow'
import { getConsultorios, darDeBajaConsultorio } from '../api/consultoriosApi'
import { useFetch } from '../hooks/useFetch'

function ConsultoriosPage() {
  const [busqueda, setBusqueda] = useState('')
  const { datos, setDatos, cargando, error, setError } = useFetch(getConsultorios)
  const consultorios = datos ?? []

  const consultoriosFiltrados = consultorios.filter((consultorio) =>
    consultorio.numero.toLowerCase().includes(busqueda.toLowerCase())
  )

  const darDeBaja = async (id) => {
    try {
      await darDeBajaConsultorio(id)
      setDatos((prev) => prev.filter((consultorio) => consultorio.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container text-start py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-label mb-1">Infraestructura</p>
          <h1 className="mb-0">Consultorios</h1>
        </div>
        <Link to="/nuevo-consultorio" className="btn btn-primary">
          Nuevo consultorio
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por número..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        disabled={cargando}
      />

      {cargando ? (
        <div className="ledger" aria-hidden="true">
          {[1, 2, 3].map((fantasma) => (
            <div className="ledger-row consultorio-row placeholder-glow" key={fantasma}>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-12"></span>
            </div>
          ))}
        </div>
      ) : consultoriosFiltrados.length === 0 ? (
        <p className="text-body-secondary">No se encontraron consultorios.</p>
      ) : (
        <div className="ledger">
          {consultoriosFiltrados.map((consultorio) => (
            <ConsultorioRow
              key={consultorio.id}
              consultorio={consultorio}
              onDarDeBaja={darDeBaja}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ConsultoriosPage
