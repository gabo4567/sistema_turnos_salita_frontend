import PacienteForm from '../components/PacienteForm'

function AltaPacientePage() {
  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Admisión</p>
      <h1 className="mb-4">Nuevo Paciente</h1>
      <PacienteForm />
    </div>
  )
}

export default AltaPacientePage
