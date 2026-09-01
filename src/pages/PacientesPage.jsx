import { useEffect, useState } from 'react'
import PacienteRow from '../components/PacienteRow'
import { getPacientes } from '../api/pacientesApi'
import { OBRAS_SOCIALES } from '../constants/pacientes'

function PacientesPage() {
  const [busqueda, setBusqueda] = useState('')
  const [obraSocial, setObraSocial] = useState('')
  const [pacientes, setPacientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false
    setCargando(true)
    setError(null)

    getPacientes({ obraSocial })
      .then((datos) => {
        if (!cancelado) setPacientes(datos)
      })
      .catch((err) => {
        if (!cancelado) setError(err.message)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [obraSocial])

  const pacientesFiltrados = pacientes.filter(
    (paciente) =>
      paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      paciente.dni.includes(busqueda)
  )

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Padrón</p>
      <h1 className="mb-4">Pacientes</h1>

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
