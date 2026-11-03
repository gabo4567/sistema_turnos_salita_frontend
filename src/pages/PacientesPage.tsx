import { useCallback, useState } from 'react'
import PacienteRow from '../components/PacienteRow'
import PacienteForm from '../components/PacienteForm'
import FormularioModal from '../components/FormularioModal'
import Paginador from '../components/Paginador'
import SelectorOrden from '../components/SelectorOrden'
import { listarPacientesPaginado, darDeBajaPaciente, type FiltrosPacientes, type OrdenPacientes } from '../api/pacientesApi'
import { extraerMensaje } from '../api/httpClient'
import { OBRAS_SOCIALES } from '../constants/pacientes'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import type { Paciente } from '../types/Paciente'

const OPCIONES_ORDEN: { valor: OrdenPacientes; etiqueta: string }[] = [
  { valor: 'apellido_asc', etiqueta: 'Apellido A-Z' },
  { valor: 'apellido_desc', etiqueta: 'Apellido Z-A' },
  { valor: 'reciente', etiqueta: 'Más recientes' },
  { valor: 'antiguo', etiqueta: 'Más antiguos' },
]

function PacientesPage() {
  const esAdmin = localStorage.getItem('rol') === 'admin'
  const [mostrarAlta, setMostrarAlta] = useState(false)
  const cerrarAlta = useCallback(() => setMostrarAlta(false), [])
  const [busqueda, setBusqueda] = useState('')
  const busquedaDebounced = useDebounce(busqueda)
  const [obraSocial, setObraSocial] = useState('')
  const [estado, setEstado] = useState<FiltrosPacientes['estado']>('activos')
  const [orden, setOrden] = useState<OrdenPacientes>('apellido_asc')
  const [pagina, setPagina] = useState(1)

  const { datos, setDatos, cargando, error, setError } = useFetch(
    () => listarPacientesPaginado({ obraSocial, estado, orden, busqueda: busquedaDebounced, pagina }),
    [obraSocial, estado, orden, busquedaDebounced, pagina]
  )
  const pacientes = datos?.items ?? []

  const cambiarFiltro = <T,>(setter: (valor: T) => void) => (valor: T) => {
    setPagina(1)
    setter(valor)
  }

  const darDeBaja = async (id: string) => {
    try {
      await darDeBajaPaciente(id)
      setDatos((prev) =>
        prev ? { ...prev, items: prev.items.filter((paciente) => paciente.id !== id) } : prev
      )
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  const agregarPaciente = (paciente: Paciente) => {
    setDatos((prev) =>
      prev
        ? { ...prev, items: [paciente, ...prev.items.filter((actual) => actual.id !== paciente.id)] }
        : prev
    )
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
        <div className="col-12 col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o DNI..."
            value={busqueda}
            onChange={(e) => cambiarFiltro(setBusqueda)(e.target.value)}
            disabled={cargando}
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={obraSocial}
            onChange={(e) => cambiarFiltro(setObraSocial)(e.target.value)}
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
        <div className="col-12 col-md-3">
          <SelectorOrden value={orden} onChange={cambiarFiltro(setOrden)} opciones={OPCIONES_ORDEN} disabled={cargando} />
        </div>
        {esAdmin && (
          <div className="col-12">
            <div className="btn-group" role="group" aria-label="Filtrar por estado">
              <button
                type="button"
                className={`btn btn-sm ${estado === 'activos' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => cambiarFiltro(setEstado)('activos')}
                disabled={cargando}
              >
                Activos
              </button>
              <button
                type="button"
                className={`btn btn-sm ${estado === 'inactivos' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => cambiarFiltro(setEstado)('inactivos')}
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
      ) : pacientes.length === 0 ? (
        <p className="text-body-secondary">No se encontraron pacientes.</p>
      ) : (
        <>
          <div className="ledger">
            {pacientes.map((paciente) => (
              <PacienteRow key={paciente.id} paciente={paciente} onDarDeBaja={darDeBaja} />
            ))}
          </div>
          {datos && (
            <Paginador
              pagina={datos.pagina}
              totalPaginas={datos.totalPaginas}
              totalRegistros={datos.totalRegistros}
              onCambiarPagina={setPagina}
              disabled={cargando}
            />
          )}
        </>
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
