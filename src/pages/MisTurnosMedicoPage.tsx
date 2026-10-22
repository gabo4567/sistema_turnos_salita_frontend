import { getMisTurnosMedico } from '../api/turnosApi'
import { useFetch } from '../hooks/useFetch'
import { ESPECIALIDADES } from '../constants/turnos'
import type { Turno } from '../types/Turno'

function MisTurnosMedicoPage() {
  const { datos, cargando, error } = useFetch<Turno[]>(getMisTurnosMedico)
  const turnos = datos ?? []

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Mi agenda</p>
      <h1 className="mb-4">Mis Turnos</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {cargando ? (
        <p className="text-body-secondary">Cargando...</p>
      ) : turnos.length === 0 ? (
        <p className="text-body-secondary">No tenés turnos asignados.</p>
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
