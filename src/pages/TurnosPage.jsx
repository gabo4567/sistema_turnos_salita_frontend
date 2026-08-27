import { useEffect, useState } from 'react'
import TurnoCard from '../components/TurnoCard'
import { getTurnos } from '../api/turnosApi'

function TurnosPage() {
  const [busqueda, setBusqueda] = useState('')
  const [turnos, setTurnos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelado = false

    const cargarTurnos = async () => {
      try {
        const datos = await getTurnos()
        if (!cancelado) {
          setTurnos([...datos].sort((a, b) => new Date(a.fechaTurno) - new Date(b.fechaTurno)))
        }
      } catch (err) {
        if (!cancelado) setError(err.message)
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    cargarTurnos()
    return () => {
      cancelado = true
    }
  }, [])

  const marcarAtendido = (id) => {
    setTurnos((prev) =>
      prev.map((turno) => (turno.id === id ? { ...turno, estado: 'atendido' } : turno))
    )
  }

  const turnosFiltrados = turnos.filter((turno) =>
    turno.paciente?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const enEspera = turnos.filter((turno) => turno.estado !== 'atendido').length
  const atendidos = turnos.filter((turno) => turno.estado === 'atendido').length

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Sala de espera</p>
      <h1 className="mb-4">Turnos del Día</h1>

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
        <div className="turnos-ledger" aria-hidden="true">
          {[1, 2, 3].map((fantasma) => (
            <div className="turno-row placeholder-glow" key={fantasma}>
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
        <div className="turnos-ledger">
          {turnosFiltrados.map((turno) => (
            <TurnoCard key={turno.id} turno={turno} onLlamar={marcarAtendido} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TurnosPage
