import { useCallback, useState } from 'react'
import PacienteRow from '../components/PacienteRow'
import PacienteForm from '../components/PacienteForm'
import FormularioModal from '../components/FormularioModal'
import { getPacientes, darDeBajaPaciente, type FiltrosPacientes } from '../api/pacientesApi'
import { extraerMensaje } from '../api/httpClient'
import { OBRAS_SOCIALES } from '../constants/pacientes'
import { useFetch } from '../hooks/useFetch'
import type { Paciente } from '../types/Paciente'

function PacientesPage() {
  const esAdmin = localStorage.getItem('rol') === 'admin'
  const [mostrarAlta, setMostrarAlta] = useState(false)
  const cerrarAlta = useCallback(() => setMostrarAlta(false), [])
  const [busqueda, setBusqueda] = useState('')
  const [obraSocial, setObraSocial] = useState('')
  const [estado, setEstado] = useState<FiltrosPacientes['estado']>('activos')
  const { datos, setDatos, cargando, error, setError } = useFetch<Paciente[]>(
    () => getPacientes({ obraSocial, estado }),
    [obraSocial, estado]
  )
  const pacientes = datos ?? []

  const pacientesFiltrados = pacientes.filter(
    (paciente) =>
      paciente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      paciente.dni.includes(busqueda)
  )

  const darDeBaja = async (id: string) => {
    try {
      await darDeBajaPaciente(id)
      setDatos((prev) => (prev ?? []).filter((paciente) => paciente.id !== id))
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  const agregarPaciente = (paciente: Paciente) => {
    setDatos((prev) => [paciente, ...(prev ?? []).filter((actual) => actual.id !== paciente.id)])
  }

  return (
    <div className="container text-start py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-label mb-1">Padrón</p>
          <h1 className="mb-0">Pacientes</h1>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setMostrarAlta(true)}>
          Nuevo paciente
        </button>
      </div>

      {error && (
        <div className={`alert ${error.startsWith('No se puede dar de baja:') ? 'alert-warning' : 'alert-danger'}`} role="alert">
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
        {esAdmin && (
          <div className="col-12">
            <div className="btn-group" role="group" aria-label="Filtrar por estado">
              <button
                type="button"
                className={`btn btn-sm ${estado === 'activos' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setEstado('activos')}
                disabled={cargando}
              >
                Activos
              </button>
              <button
                type="button"
                className={`btn btn-sm ${estado === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setEstado('todos')}
                disabled={cargando}
              >
                Ver inactivos
              </button>
            </div>
          </div>
        )}
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
            <PacienteRow key={paciente.id} paciente={paciente} onDarDeBaja={darDeBaja} />
          ))}
        </div>
      )}

      {mostrarAlta && (
        <FormularioModal titulo="Nuevo paciente" onClose={cerrarAlta}>
          <PacienteForm onCreated={agregarPaciente} />
        </FormularioModal>
      )}
    </div>
  )
}

export default PacientesPage
