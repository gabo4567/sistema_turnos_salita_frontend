import { useState } from 'react'
import TurnoCard from '../components/TurnoCard'

const turnosMock = [
  { id: 1, paciente: 'Tomas Gallardo' },
  { id: 2, paciente: 'Marina Lopez' },
  { id: 3, paciente: 'Susana Ibañez' },
  { id: 4, paciente: 'Roque Gimenez' },
  { id: 5, paciente: 'Ernesto Roura' },
  { id: 6, paciente: 'Juan Pared' },
  { id: 7, paciente: 'Marisol Nuñez' },
  { id: 8, paciente: 'Lucia Fernandez' },
  { id: 9, paciente: 'Diego Alvarez' },
]

function TurnosPage() {
  const [busqueda, setBusqueda] = useState('')

  const turnosFiltrados = turnosMock.filter((turno) =>
    turno.paciente.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="container text-start py-4">
      <h1 className="mb-4">Turnos del Día</h1>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Buscar paciente..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="row g-3">
        {turnosFiltrados.map((turno) => (
          <div className="col-12 col-sm-6 col-lg-4" key={turno.id}>
            <TurnoCard paciente={turno.paciente} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TurnosPage
