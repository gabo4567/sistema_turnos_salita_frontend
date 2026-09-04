import { useState } from 'react'
import { Link } from 'react-router-dom'
import PacienteRow from '../components/PacienteRow'
import { getPacientes } from '../api/pacientesApi'
import { OBRAS_SOCIALES } from '../constants/pacientes'
import { useFetch } from '../hooks/useFetch'

function PacientesPage() {
  const [busqueda, setBusqueda] = useState('')
  const [obraSocial, setObraSocial] = useState('')
  const { datos, cargando, error } = useFetch(() => getPacientes({ obraSocial }), [obraSocial])
  const pacientes = datos ?? []

  const pacientesFiltrados = pacientes.filter(
    (paciente) =>
      paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      paciente.dni.includes(busqueda)
  )

  return (
    <div className="container text-start py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-label mb-1">Padrón</p>
          <h1 className="mb-0">Pacientes</h1>
        </div>
        <Link to="/nuevo-paciente" className="btn btn-primary">
          Nuevo paciente
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o DNI..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            disabled={cargando}
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={obraSocial}
            onChange={(e) => setObraSocial(e.target.value)}
            disabled={cargando}
          >
            <option value="">Todas las obras sociales</option>
            {OBRAS_SOCIALES.map((os) => (
              <option key={os} value={os}>
                {os}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando ? (
        <div className="ledger" aria-hidden="true">
          {[1, 2, 3].map((fantasma) => (
            <div className="ledger-row paciente-row placeholder-glow" key={fantasma}>
              <span>
                <span className="placeholder col-6 d-block mb-1"></span>
                <span className="placeholder col-4"></span>
              </span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-12"></span>
            </div>
          ))}
        </div>
      ) : pacientesFiltrados.length === 0 ? (
        <p className="text-body-secondary">No se encontraron pacientes.</p>
      ) : (
        <div className="ledger">
          {pacientesFiltrados.map((paciente) => (
            <PacienteRow key={paciente.id} paciente={paciente} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PacientesPage
