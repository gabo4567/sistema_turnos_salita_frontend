import { useState } from 'react'
import { Link } from 'react-router-dom'
import TurnoCard from '../components/TurnoCard'
import { getTurnos, cancelarTurno, marcarLlamado, marcarFinalizado, type FiltroEstado } from '../api/turnosApi'
import { extraerMensaje } from '../api/httpClient'
import { useFetch } from '../hooks/useFetch'
import type { Turno } from '../types/Turno'

const ordenarPorFecha = (turnos: Turno[]) =>
  [...turnos].sort((a, b) => new Date(a.fechaTurno).getTime() - new Date(b.fechaTurno).getTime())

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
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<'hoy' | 'todos'>('hoy')
  const [estado, setEstado] = useState<FiltroEstado>('activos')
  const { datos, setDatos, cargando, error, setError } = useFetch<Turno[]>(
    () => getTurnos(estado).then(ordenarPorFecha),
    [estado]
  )
  const turnos = datos ?? []

  // Aparte del listado filtrable, un fetch propio para las estadísticas del
  // día — siempre "activos", para que no cambien según qué filtro de
  // estado haya elegido el usuario para la tabla de abajo.
  const { datos: datosStats } = useFetch<Turno[]>(() => getTurnos('activos'))
  const turnosStats = datosStats ?? []

  const llamar = async (id: string) => {
    try {
      const turnoActualizado = await marcarLlamado(id)
      setDatos((prev) => (prev ?? []).map((turno) => (turno.id === id ? turnoActualizado : turno)))
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  const finalizar = async (id: string) => {
    try {
      const turnoActualizado = await marcarFinalizado(id)
      setDatos((prev) => (prev ?? []).map((turno) => (turno.id === id ? turnoActualizado : turno)))
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  const cancelar = async (id: string) => {
    try {
      await cancelarTurno(id)
      // No alcanza con sacarlo de la lista: según el filtro de estado
      // activo (ej. "Cancelados" o "Todos"), el turno cancelado tiene que
      // seguir apareciendo, así que se vuelve a pedir la lista completa.
      setDatos(await getTurnos(estado).then(ordenarPorFecha))
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  // Para la tira de estadísticas, siempre sobre "activos" (turnosStats),
  // sin importar qué estado haya elegido el usuario para la tabla.
  const statsHoy = turnosStats.filter((turno) => esHoy(turno.fechaTurno))
  const enEsperaHoy = statsHoy.filter((turno) => turno.estado === 'pendiente' || turno.estado === 'llamado').length
  const atendidosHoy = statsHoy.filter((turno) => turno.estado === 'atendido').length

  // Para la tabla, sobre el listado filtrado por el estado elegido.
  const turnosFiltrados = (filtro === 'hoy' ? turnos.filter((turno) => esHoy(turno.fechaTurno)) : turnos).filter(
    (turno) => turno.paciente?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

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

      <div className="d-flex flex-wrap gap-3 mb-3">
        <div className="btn-group" role="group" aria-label="Filtrar por fecha">
          <button
            type="button"
            className={`btn btn-sm ${filtro === 'hoy' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFiltro('hoy')}
            disabled={cargando}
          >
            Hoy
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filtro === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFiltro('todos')}
            disabled={cargando}
          >
            Todos
          </button>
        </div>
        <div className="btn-group" role="group" aria-label="Filtrar por estado">
          {OPCIONES_ESTADO.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              className={`btn btn-sm ${estado === opcion.valor ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setEstado(opcion.valor)}
              disabled={cargando}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="form-control flex-grow-1"
          style={{ minWidth: '200px' }}
          placeholder="Buscar paciente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          disabled={cargando}
        />
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
      ) : turnosFiltrados.length === 0 ? (
        <p className="text-body-secondary">
          {filtro === 'hoy' ? 'No hay turnos para hoy.' : 'No se encontraron turnos.'}
        </p>
      ) : (
        <div className="ledger">
          {turnosFiltrados.map((turno) => (
            <TurnoCard key={turno.id} turno={turno} onLlamar={llamar} onFinalizar={finalizar} onCancelar={cancelar} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TurnosPage
