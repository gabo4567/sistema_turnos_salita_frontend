import { getMisTurnos, cancelarTurno } from '../api/turnosApi'
import { extraerMensaje } from '../api/httpClient'
import { useFetch } from '../hooks/useFetch'
import { useConfirm } from '../hooks/useConfirm'
import { ESPECIALIDADES } from '../constants/turnos'
import type { Turno } from '../types/Turno'

function MisTurnosPage() {
  const { datos, setDatos, cargando, error, setError } = useFetch<Turno[]>(getMisTurnos)
  const confirmar = useConfirm()
  const turnos = datos ?? []

  const handleCancelar = async (id: string) => {
    const ok = await confirmar('¿Cancelar este turno?', {
      variante: 'peligro',
      textoConfirmar: 'Cancelar turno',
    })
    if (!ok) return

    try {
      await cancelarTurno(id)
      setDatos((prev) => (prev ?? []).filter((turno) => turno.id !== id))
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Mi cuenta</p>
      <h1 className="mb-4">Mis Turnos</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {cargando ? (
        <p className="text-body-secondary">Cargando...</p>
      ) : turnos.length === 0 ? (
        <p className="text-body-secondary">Todavía no tenés turnos agendados.</p>
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
                  <span className="paciente d-block">
                    {turno.medico ? `${turno.medico.nombre} ${turno.medico.apellido}` : 'Médico a confirmar'}
                  </span>
                  <span className="obra-social">
                    {ESPECIALIDADES.find((e) => e.valor === turno.especialidad)?.etiqueta}
                    {turno.consultorio && ` · Consultorio ${turno.consultorio.numero}`}
                  </span>
                </span>
                <span className={`badge-estado ${atendido ? 'atendido' : 'espera'}`}>
                  {atendido ? 'Atendido' : 'Pendiente'}
                </span>
                <span className="d-flex gap-2">
                  {!atendido && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleCancelar(turno.id)}
                    >
                      Cancelar
                    </button>
                  )}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MisTurnosPage
