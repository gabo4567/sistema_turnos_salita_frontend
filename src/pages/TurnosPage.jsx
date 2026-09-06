import { useState } from 'react'
import { Link } from 'react-router-dom'
import TurnoCard from '../components/TurnoCard'
import { getTurnos, cancelarTurno } from '../api/turnosApi'
import { useFetch } from '../hooks/useFetch'

const ordenarPorFecha = (turnos) =>
  [...turnos].sort((a, b) => new Date(a.fechaTurno) - new Date(b.fechaTurno))

const esHoy = (fechaTurno) => {
  const fecha = new Date(fechaTurno)
  const hoy = new Date()
  return (
    fecha.getFullYear() === hoy.getFullYear() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getDate() === hoy.getDate()
  )
}

function TurnosPage() {
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('hoy')
  const { datos, setDatos, cargando, error, setError } = useFetch(() =>
    getTurnos().then(ordenarPorFecha)
  )
  const turnos = datos ?? []

  const marcarAtendido = (id) => {
    setDatos((prev) =>
      prev.map((turno) => (turno.id === id ? { ...turno, estado: 'atendido' } : turno))
    )
  }

  const cancelar = async (id) => {
    try {
      await cancelarTurno(id)
      setDatos((prev) => prev.filter((turno) => turno.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const turnosHoy = turnos.filter((turno) => esHoy(turno.fechaTurno))
  const enEsperaHoy = turnosHoy.filter((turno) => turno.estado !== 'atendido').length
  const atendidosHoy = turnosHoy.filter((turno) => turno.estado === 'atendido').length

  const turnosFiltrados = (filtro === 'hoy' ? turnosHoy : turnos).filter((turno) =>
    turno.paciente?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
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
          <span className="value">{cargando ? '–' : turnosHoy.length}</span>
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
            <TurnoCard key={turno.id} turno={turno} onLlamar={marcarAtendido} onCancelar={cancelar} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TurnosPage
