import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import TurnoCard from '../components/TurnoCard'
import Paginador from '../components/Paginador'
import {
  getTurnos,
  listarTurnosPaginado,
  cancelarTurno,
  marcarLlamado,
  marcarFinalizado,
  type FiltroEstado,
  type FiltrosListadoTurnos,
} from '../api/turnosApi'
import { getMedicos } from '../api/medicosApi'
import { extraerMensaje } from '../api/httpClient'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import { useAutoDismiss } from '../hooks/useAutoDismiss'
import { ESPECIALIDADES } from '../constants/turnos'
import type { Turno, Especialidad } from '../types/Turno'
import type { Medico } from '../types/Medico'
import { nombreCompleto } from '../utils/texto'

const esHoy = (fechaTurno: string) => {
  const fecha = new Date(fechaTurno)
  const hoy = new Date()
  return (
    fecha.getFullYear() === hoy.getFullYear() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getDate() === hoy.getDate()
  )
}

const OPCIONES_ESTADO: { valor: FiltroEstado; etiqueta: string }[] = [
  { valor: 'activos', etiqueta: 'Activos' },
  { valor: 'cancelado', etiqueta: 'Cancelados' },
  { valor: 'no_asistio', etiqueta: 'No asistió' },
  { valor: 'todos', etiqueta: 'Todos' },
]

function TurnosPage() {
  const location = useLocation()
  const [turnoAgendado, setTurnoAgendado] = useState(
    Boolean((location.state as { turnoAgendado?: boolean } | null)?.turnoAgendado)
  )
  useAutoDismiss(turnoAgendado, () => setTurnoAgendado(false))

  const [busqueda, setBusqueda] = useState('')
  const busquedaDebounced = useDebounce(busqueda)
  const [rango, setRango] = useState<'hoy' | 'todos'>('hoy')
  const [estado, setEstado] = useState<FiltroEstado>('activos')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [medico, setMedico] = useState('')
  const [especialidad, setEspecialidad] = useState<Especialidad | ''>('')
  const [pagina, setPagina] = useState(1)
  const hayFiltroFecha = Boolean(fechaDesde || fechaHasta)

  const filtros: FiltrosListadoTurnos = {
    estado,
    medico: medico || undefined,
    especialidad: especialidad || undefined,
    ...(hayFiltroFecha ? { fechaDesde: fechaDesde || undefined, fechaHasta: fechaHasta || undefined } : { rango }),
    busquedaPaciente: busquedaDebounced || undefined,
    pagina,
  }

  const { datos, setDatos, cargando, error, setError } = useFetch(
    () => listarTurnosPaginado(filtros),
    [estado, medico, especialidad, hayFiltroFecha, fechaDesde, fechaHasta, rango, busquedaDebounced, pagina]
  )
  const turnos = datos?.items ?? []

  const { datos: medicosActivos } = useFetch<Medico[]>(() => getMedicos())

  // Aparte del listado filtrable, un fetch propio para las estadísticas del
  // día — siempre "activos", sin ninguno de los filtros nuevos, para que no
  // cambien según qué haya elegido el usuario para la tabla de abajo.
  const { datos: datosStats } = useFetch<Turno[]>(() => getTurnos('activos'))
  const turnosStats = datosStats ?? []

  const cambiarFiltro = <T,>(setter: (valor: T) => void) => (valor: T) => {
    setPagina(1)
    setter(valor)
  }

  const recargar = () => listarTurnosPaginado(filtros).then(setDatos)

  const llamar = async (id: string) => {
    try {
      const turnoActualizado = await marcarLlamado(id)
      setDatos((prev) =>
        prev ? { ...prev, items: prev.items.map((t) => (t.id === id ? turnoActualizado : t)) } : prev
      )
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  const finalizar = async (id: string) => {
    try {
      const turnoActualizado = await marcarFinalizado(id)
      setDatos((prev) =>
        prev ? { ...prev, items: prev.items.map((t) => (t.id === id ? turnoActualizado : t)) } : prev
      )
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  const cancelar = async (id: string) => {
    try {
      await cancelarTurno(id)
      // No alcanza con sacarlo de la lista: según el filtro de estado
      // activo (ej. "Cancelados" o "Todos"), el turno cancelado tiene que
      // seguir apareciendo, así que se vuelve a pedir la página actual.
      await recargar()
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  // Para la tira de estadísticas, siempre sobre "activos" (turnosStats),
  // sin importar qué filtros haya elegido el usuario para la tabla.
  const statsHoy = turnosStats.filter((turno) => esHoy(turno.fechaTurno))
  const enEsperaHoy = statsHoy.filter((turno) => turno.estado === 'pendiente' || turno.estado === 'llamado').length
  const atendidosHoy = statsHoy.filter((turno) => turno.estado === 'atendido').length

  return (
    <div className="container text-start py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-label mb-1">Agenda</p>
          <h1 className="mb-0">Turnos</h1>
        </div>
        <Link to="/nuevo-turno" className="btn btn-primary">
          Nuevo turno
        </Link>
      </div>

      {turnoAgendado && (
        <div className="alert alert-success" role="status">
          Turno agendado correctamente.
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="stat-strip">
        <div className="stat-tile">
          <span className="value">{cargando ? '–' : statsHoy.length}</span>
          <span className="label">Turnos hoy</span>
        </div>
        <div className="stat-tile">
          <span className="value">{cargando ? '–' : enEsperaHoy}</span>
          <span className="label">En espera</span>
        </div>
        <div className="stat-tile">
          <span className="value">{cargando ? '–' : atendidosHoy}</span>
          <span className="label">Atendidos</span>
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
        <div className="btn-group" role="group" aria-label="Filtrar por fecha">
          <button
            type="button"
            className={`btn btn-sm ${rango === 'hoy' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => cambiarFiltro(setRango)('hoy')}
            disabled={cargando || hayFiltroFecha}
          >
            Hoy
          </button>
          <button
            type="button"
            className={`btn btn-sm ${rango === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => cambiarFiltro(setRango)('todos')}
            disabled={cargando || hayFiltroFecha}
          >
            Todos
          </button>
        </div>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="fechaDesde" className="form-label mb-0 small text-body-secondary">
            Desde
          </label>
          <input
            id="fechaDesde"
            type="date"
            className="form-control form-control-sm"
            value={fechaDesde}
            onChange={(e) => cambiarFiltro(setFechaDesde)(e.target.value)}
            disabled={cargando}
          />
          <label htmlFor="fechaHasta" className="form-label mb-0 small text-body-secondary">
            Hasta
          </label>
          <input
            id="fechaHasta"
            type="date"
            className="form-control form-control-sm"
            value={fechaHasta}
            onChange={(e) => cambiarFiltro(setFechaHasta)(e.target.value)}
            disabled={cargando}
          />
          {hayFiltroFecha && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setPagina(1)
                setFechaDesde('')
                setFechaHasta('')
              }}
              disabled={cargando}
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="btn-group" role="group" aria-label="Filtrar por estado">
          {OPCIONES_ESTADO.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              className={`btn btn-sm ${estado === opcion.valor ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => cambiarFiltro(setEstado)(opcion.valor)}
              disabled={cargando}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por paciente..."
            value={busqueda}
            onChange={(e) => cambiarFiltro(setBusqueda)(e.target.value)}
            disabled={cargando}
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={medico}
            onChange={(e) => cambiarFiltro(setMedico)(e.target.value)}
            disabled={cargando}
          >
            <option value="">Todos los médicos</option>
            {(medicosActivos ?? []).map((m) => (
              <option key={m.id} value={m.id}>
                {nombreCompleto(m)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={especialidad}
            onChange={(e) => cambiarFiltro(setEspecialidad)(e.target.value as Especialidad | '')}
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
      </div>

      {cargando ? (
        <div className="ledger" aria-hidden="true">
          {[1, 2, 3].map((fantasma) => (
            <div className="ledger-row turno-row placeholder-glow" key={fantasma}>
              <span className="placeholder col-8"></span>
              <span>
                <span className="placeholder col-6 d-block mb-1"></span>
                <span className="placeholder col-4"></span>
              </span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-12"></span>
            </div>
          ))}
        </div>
      ) : turnos.length === 0 ? (
        <p className="text-body-secondary">
          {hayFiltroFecha
            ? 'No se encontraron turnos en ese rango de fechas.'
            : rango === 'hoy'
              ? 'No hay turnos para hoy.'
              : 'No se encontraron turnos.'}
        </p>
      ) : (
        <>
          <div className="ledger">
            {turnos.map((turno) => (
              <TurnoCard key={turno.id} turno={turno} onLlamar={llamar} onFinalizar={finalizar} onCancelar={cancelar} />
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
    </div>
  )
}

export default TurnosPage
