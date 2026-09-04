import { useState } from 'react'
import { Link } from 'react-router-dom'
import MedicoRow from '../components/MedicoRow'
import { getMedicos } from '../api/medicosApi'
import { useFetch } from '../hooks/useFetch'

function MedicosPage() {
  const [busqueda, setBusqueda] = useState('')
  const { datos, cargando, error } = useFetch(getMedicos)
  const medicos = datos ?? []

  const medicosFiltrados = medicos.filter(
    (medico) =>
      medico.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      medico.matricula.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="container text-start py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-label mb-1">Cuerpo médico</p>
          <h1 className="mb-0">Médicos</h1>
        </div>
        <Link to="/nuevo-medico" className="btn btn-primary">
          Nuevo médico
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
        placeholder="Buscar por nombre o matrícula..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        disabled={cargando}
      />

      {cargando ? (
        <div className="ledger" aria-hidden="true">
          {[1, 2, 3].map((fantasma) => (
            <div className="ledger-row medico-row placeholder-glow" key={fantasma}>
              <span>
                <span className="placeholder col-6 d-block mb-1"></span>
                <span className="placeholder col-4"></span>
              </span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-6"></span>
            </div>
          ))}
        </div>
      ) : medicosFiltrados.length === 0 ? (
        <p className="text-body-secondary">No se encontraron médicos.</p>
      ) : (
        <div className="ledger">
          {medicosFiltrados.map((medico) => (
            <MedicoRow key={medico.id} medico={medico} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MedicosPage
