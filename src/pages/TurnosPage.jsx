import TurnoCard from '../components/TurnoCard'
import './TurnosPage.css'

const turnosMock = [
  { id: 1, paciente: 'Juan Perez', horario: '09:00' },
  { id: 2, paciente: 'Maria Gomez', horario: '09:30' },
  { id: 3, paciente: 'Carlos Diaz', horario: '10:00' },
]

function TurnosPage() {
  return (
    <section className="turnos-page">
      <h1>Turnos de hoy</h1>
      <div className="turnos-lista">
        {turnosMock.map((turno) => (
          <TurnoCard key={turno.id} paciente={turno.paciente} horario={turno.horario} />
        ))}
      </div>
    </section>
  )
}

export default TurnosPage
