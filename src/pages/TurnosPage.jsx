import { useState } from 'react'
import { Link } from 'react-router-dom'
import TurnoCard from '../components/TurnoCard'
import { getTurnos, cancelarTurno } from '../api/turnosApi'
import { useFetch } from '../hooks/useFetch'

const ordenarPorFecha = (turnos) =>
  [...turnos].sort((a, b) => new Date(a.fechaTurno) - new Date(b.fechaTurno))

function TurnosPage() {
  const [busqueda, setBusqueda] = useState('')
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

  const turnosFiltrados = turnos.filter((turno) =>
    turno.paciente?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const enEspera = turnos.filter((turno) => turno.estado !== 'atendido').length
  const atendidos = turnos.filter((turno) => turno.estado === 'atendido').length

  return (
    <div className="container text-start py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-label mb-1">Sala de espera</p>
          <h1 className="mb-0">Turnos del Día</h1>
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
          <span className="value">{cargando ? '–' : turnos.length}</span>
          <span className="label">Turnos hoy</span>
        </div>
        <div className="stat-tile">
          <span className="value">{cargando ? '–' : enEspera}</span>
          <span className="label">En espera</span>
        </div>
        <div className="stat-tile">
          <span className="value">{cargando ? '–' : atendidos}</span>
          <span className="label">Atendidos</span>
        </div>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar paciente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        disabled={cargando}
      />

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
        <p className="text-body-secondary">No se encontraron turnos.</p>
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
