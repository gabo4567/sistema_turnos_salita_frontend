import { useNavigate } from 'react-router-dom'
import PacienteForm from '../components/PacienteForm'

function AltaPacientePage() {
  const navigate = useNavigate()

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Admisión</p>
      <h1 className="mb-4">Nuevo Paciente</h1>
      <PacienteForm onCancel={() => navigate(-1)} />
    </div>
  )
}

export default AltaPacientePage
