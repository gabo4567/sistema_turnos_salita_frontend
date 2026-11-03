import { useCallback, useState } from 'react'
import MedicoRow from '../components/MedicoRow'
import MedicoForm from '../components/MedicoForm'
import FormularioModal from '../components/FormularioModal'
import Paginador from '../components/Paginador'
import SelectorOrden from '../components/SelectorOrden'
import { listarMedicosPaginado, darDeBajaMedico, type FiltrosMedicos, type OrdenMedicos } from '../api/medicosApi'
import { extraerMensaje } from '../api/httpClient'
import { ESPECIALIDADES } from '../constants/turnos'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import type { Medico } from '../types/Medico'

const OPCIONES_ORDEN: { valor: OrdenMedicos; etiqueta: string }[] = [
  { valor: 'apellido_asc', etiqueta: 'Apellido A-Z' },
  { valor: 'apellido_desc', etiqueta: 'Apellido Z-A' },
  { valor: 'reciente', etiqueta: 'Más recientes' },
  { valor: 'antiguo', etiqueta: 'Más antiguos' },
]

function MedicosPage() {
  const esAdmin = localStorage.getItem('rol') === 'admin'
  const [mostrarAlta, setMostrarAlta] = useState(false)
  const cerrarAlta = useCallback(() => setMostrarAlta(false), [])
  const [busqueda, setBusqueda] = useState('')
  const busquedaDebounced = useDebounce(busqueda)
  const [especialidad, setEspecialidad] = useState('')
  const [estado, setEstado] = useState<FiltrosMedicos['estado']>('activos')
  const [orden, setOrden] = useState<OrdenMedicos>('apellido_asc')
  const [pagina, setPagina] = useState(1)

  const { datos, setDatos, cargando, error, setError } = useFetch(
    () => listarMedicosPaginado({ estado, especialidad, orden, busqueda: busquedaDebounced, pagina }),
    [estado, especialidad, orden, busquedaDebounced, pagina]
  )
  const medicos = datos?.items ?? []

  const cambiarFiltro = <T,>(setter: (valor: T) => void) => (valor: T) => {
    setPagina(1)
    setter(valor)
  }

  const darDeBaja = async (id: string) => {
    try {
      await darDeBajaMedico(id)
      setDatos((prev) => (prev ? { ...prev, items: prev.items.filter((medico) => medico.id !== id) } : prev))
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  const agregarMedico = (medico: Medico) => {
    setDatos((prev) =>
      prev ? { ...prev, items: [medico, ...prev.items.filter((actual) => actual.id !== medico.id)] } : prev
    )
  }

  return (
    <div className="container text-start py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-label mb-1">Cuerpo médico</p>
          <h1 className="mb-0">Médicos</h1>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setMostrarAlta(true)}>
          Nuevo médico
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
            placeholder="Buscar por nombre o matrícula..."
            value={busqueda}
            onChange={(e) => cambiarFiltro(setBusqueda)(e.target.value)}
            disabled={cargando}
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={especialidad}
            onChange={(e) => cambiarFiltro(setEspecialidad)(e.target.value)}
            disabled={cargando}
          >
            <option value="">Todas las especialidades</option>
            {ESPECIALIDADES.map((esp) => (
              <option key={esp.valor} value={esp.valor}>
                {esp.etiqueta}
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
            <div className="ledger-row medico-row placeholder-glow" key={fantasma}>
              <span>
                <span className="placeholder col-6 d-block mb-1"></span>
                <span className="placeholder col-4"></span>
              </span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-12"></span>
            </div>
          ))}
        </div>
      ) : medicos.length === 0 ? (
        <p className="text-body-secondary">No se encontraron médicos.</p>
      ) : (
        <>
          <div className="ledger">
            {medicos.map((medico) => (
              <MedicoRow key={medico.id} medico={medico} onDarDeBaja={darDeBaja} />
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
        <FormularioModal titulo="Nuevo médico" onClose={cerrarAlta}>
          <MedicoForm onCreated={agregarMedico} />
        </FormularioModal>
      )}
    </div>
  )
}

export default MedicosPage
