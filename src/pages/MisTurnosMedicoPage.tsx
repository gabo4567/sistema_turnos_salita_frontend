import { useState } from 'react'
import {
  listarMisTurnosMedicoPaginado,
  cancelarTurno,
  marcarAusenciaMedico,
  marcarLlamado,
  marcarFinalizado,
  type FiltroEstado,
} from '../api/turnosApi'
import { extraerMensaje } from '../api/httpClient'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import { useConfirm } from '../hooks/useConfirm'
import { useAutoDismiss } from '../hooks/useAutoDismiss'
import { ESPECIALIDADES } from '../constants/turnos'
import { nombreCompleto } from '../utils/texto'
import Paginador from '../components/Paginador'

const OPCIONES_ESTADO: { valor: FiltroEstado; etiqueta: string }[] = [
  { valor: 'pendiente', etiqueta: 'Pendientes' },
  { valor: 'llamado', etiqueta: 'Llamados' },
  { valor: 'atendido', etiqueta: 'Atendidos' },
  { valor: 'cancelado', etiqueta: 'Cancelados' },
  { valor: 'no_asistio', etiqueta: 'No asistió' },
  { valor: 'todos', etiqueta: 'Todos' },
]

const ETIQUETAS_ESTADO: Record<string, string> = {
  pendiente: 'Pendiente',
  llamado: 'Llamado',
  atendido: 'Atendido',
  cancelado: 'Cancelado',
  no_asistio: 'No asistió',
}

const CLASES_ESTADO: Record<string, string> = {
  pendiente: 'espera',
  llamado: 'llamado',
  atendido: 'atendido',
  cancelado: 'cancelado',
  no_asistio: 'no-asistio',
}

function MisTurnosMedicoPage() {
  const [estado, setEstado] = useState<FiltroEstado>('pendiente')
  const [rango, setRango] = useState<'hoy' | 'todos'>('hoy')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const busquedaDebounced = useDebounce(busqueda)
  const [pagina, setPagina] = useState(1)
  const hayFiltroFecha = Boolean(fechaDesde || fechaHasta)
  const [errorAccion, setErrorAccion] = useState<string | null>(null)
  const [avisoAusencia, setAvisoAusencia] = useState<string | null>(null)
  useAutoDismiss(avisoAusencia, () => setAvisoAusencia(null))
  const confirmar = useConfirm()

  const filtros = {
    estado,
    ...(hayFiltroFecha ? { fechaDesde: fechaDesde || undefined, fechaHasta: fechaHasta || undefined } : { rango }),
    busquedaPaciente: busquedaDebounced || undefined,
    pagina,
  }

  const { datos, setDatos, cargando, error } = useFetch(
    () => listarMisTurnosMedicoPaginado(filtros),
    [estado, rango, hayFiltroFecha, fechaDesde, fechaHasta, busquedaDebounced, pagina]
  )
  const turnos = datos?.items ?? []

  const cambiarFiltro = <T,>(setter: (valor: T) => void) => (valor: T) => {
    setPagina(1)
    setter(valor)
  }

  const recargar = async () => {
    setDatos(await listarMisTurnosMedicoPaginado(filtros))
  }

  const handleLlamar = async (id: string) => {
    setErrorAccion(null)
    try {
      await marcarLlamado(id)
      await recargar()
    } catch (err) {
      setErrorAccion(extraerMensaje(err))
    }
  }

  const handleFinalizar = async (id: string) => {
    setErrorAccion(null)
    try {
      await marcarFinalizado(id)
      await recargar()
    } catch (err) {
      setErrorAccion(extraerMensaje(err))
    }
  }

  const handleNoPuedoAtender = async (id: string) => {
    const ok = await confirmar('¿Marcar que no podés atender este turno?', {
      variante: 'peligro',
      textoConfirmar: 'No puedo atender',
    })
    if (!ok) return

    setErrorAccion(null)
    try {
      await cancelarTurno(id)
      await recargar()
    } catch (err) {
      setErrorAccion(extraerMensaje(err))
    }
  }

  const handleAusenciaHoy = async () => {
    const ok = await confirmar(
      '¿Cancelar TODOS tus turnos pendientes de hoy? Esta acción no se puede deshacer.',
      { variante: 'peligro', textoConfirmar: 'No puedo atender hoy' }
    )
    if (!ok) return

    setErrorAccion(null)
    setAvisoAusencia(null)
    try {
      const resultado = await marcarAusenciaMedico()
      setAvisoAusencia(
        resultado.cancelados > 0
          ? `Se cancelaron ${resultado.cancelados} turno(s) de hoy.`
          : 'No tenías turnos pendientes hoy.'
      )
      await recargar()
    } catch (err) {
      setErrorAccion(extraerMensaje(err))
    }
  }

  return (
    <div className="container text-start py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-label mb-1">Mi agenda</p>
          <h1 className="mb-0">Mis Turnos</h1>
        </div>
        <button type="button" className="btn btn-outline-danger" onClick={handleAusenciaHoy}>
          No puedo atender hoy
        </button>
      </div>

      {avisoAusencia && (
        <div className="alert alert-success" role="status">
          {avisoAusencia}
        </div>
      )}

      {(error || errorAccion) && (
        <div className="alert alert-danger" role="alert">
          {error || errorAccion}
        </div>
      )}

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

      <input
        type="text"
        className="form-control mb-3"
        style={{ maxWidth: '320px' }}
        placeholder="Buscar paciente..."
        value={busqueda}
        onChange={(e) => cambiarFiltro(setBusqueda)(e.target.value)}
        disabled={cargando}
      />

      {cargando ? (
        <p className="text-body-secondary">Cargando...</p>
      ) : turnos.length === 0 ? (
        <p className="text-body-secondary">No se encontraron turnos para este filtro.</p>
      ) : (
        <>
        <div className="ledger">
          {turnos.map((turno) => {
            const estado = turno.estado ?? 'pendiente'
            const pendiente = estado === 'pendiente'
            const llamado = estado === 'llamado'
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
                  <span className="paciente d-block">{turno.paciente ? nombreCompleto(turno.paciente) : 'Paciente sin datos'}</span>
                  <span className="obra-social">
                    {estado === 'cancelado' && turno.observaciones
                      ? turno.observaciones
                      : ESPECIALIDADES.find((e) => e.valor === turno.especialidad)?.etiqueta}
                    {turno.consultorio && ` · Consultorio ${turno.consultorio.numero}`}
                  </span>
                </span>
                <span className={`badge-estado ${CLASES_ESTADO[estado] ?? estado}`}>
                  {ETIQUETAS_ESTADO[estado] ?? estado}
                </span>
                <span className="d-flex gap-2">
                  {pendiente && (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleLlamar(turno.id)}
                    >
                      Llamar
                    </button>
                  )}
                  {llamado && (
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handleFinalizar(turno.id)}
                    >
                      Finalizar consulta
                    </button>
                  )}
                  {(pendiente || llamado) && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleNoPuedoAtender(turno.id)}
                    >
                      No puedo atender
                    </button>
                  )}
                </span>
              </div>
            )
          })}
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

export default MisTurnosMedicoPage
