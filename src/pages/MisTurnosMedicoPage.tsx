import { useState } from 'react'
import { getMisTurnosMedico, type PeriodoFiltro } from '../api/turnosApi'
import { useFetch } from '../hooks/useFetch'
import { ESPECIALIDADES } from '../constants/turnos'
import { normalizarTexto } from '../utils/texto'
import type { Turno, EstadoTurno } from '../types/Turno'

type EstadoFiltro = EstadoTurno | 'todos'

const OPCIONES_ESTADO: { valor: EstadoFiltro; etiqueta: string }[] = [
  { valor: 'pendiente', etiqueta: 'Pendientes' },
  { valor: 'atendido', etiqueta: 'Atendidos' },
  { valor: 'todos', etiqueta: 'Todos' },
]

const OPCIONES_PERIODO: { valor: PeriodoFiltro | 'todos'; etiqueta: string }[] = [
  { valor: 'hoy', etiqueta: 'Hoy' },
  { valor: 'semana', etiqueta: 'Esta semana' },
  { valor: 'mes', etiqueta: 'Este mes' },
  { valor: '6meses', etiqueta: 'Últimos 6 meses' },
  { valor: 'todos', etiqueta: 'Todos' },
]

function MisTurnosMedicoPage() {
  const [estado, setEstado] = useState<EstadoFiltro>('pendiente')
  const [periodo, setPeriodo] = useState<PeriodoFiltro | 'todos'>('hoy')
  const [busqueda, setBusqueda] = useState('')

  const { datos, cargando, error } = useFetch<Turno[]>(
    () =>
      getMisTurnosMedico({
        estado: estado === 'todos' ? undefined : estado,
        periodo: periodo === 'todos' ? undefined : periodo,
      }),
    [estado, periodo]
  )

  const turnos = (datos ?? []).filter((turno) =>
    turno.paciente?.nombre && normalizarTexto(turno.paciente.nombre).includes(normalizarTexto(busqueda))
  )

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Mi agenda</p>
      <h1 className="mb-4">Mis Turnos</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="d-flex flex-wrap gap-2 mb-3">
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
        <div className="btn-group" role="group" aria-label="Filtrar por período">
          {OPCIONES_PERIODO.map((opcion) => (
            <button
              key={opcion.valor}
              type="button"
              className={`btn btn-sm ${periodo === opcion.valor ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setPeriodo(opcion.valor)}
              disabled={cargando}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        style={{ maxWidth: '320px' }}
        placeholder="Buscar paciente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        disabled={cargando}
      />

      {cargando ? (
        <p className="text-body-secondary">Cargando...</p>
      ) : turnos.length === 0 ? (
        <p className="text-body-secondary">No se encontraron turnos para este filtro.</p>
      ) : (
        <div className="ledger">
          {turnos.map((turno) => {
            const atendido = turno.estado === 'atendido'
            const fecha = new Date(turno.fechaTurno)

            return (
              <div className="ledger-row turno-row" key={turno.id}>
                <span className="hora">
                  <span className="dia d-block">
                    {fecha.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  {fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
                <span>
                  <span className="paciente d-block">{turno.paciente?.nombre ?? 'Paciente sin datos'}</span>
                  <span className="obra-social">
                    {ESPECIALIDADES.find((e) => e.valor === turno.especialidad)?.etiqueta}
                    {turno.consultorio && ` · Consultorio ${turno.consultorio.numero}`}
                  </span>
                </span>
                <span className={`badge-estado ${atendido ? 'atendido' : 'espera'}`}>
                  {atendido ? 'Atendido' : 'Pendiente'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MisTurnosMedicoPage
