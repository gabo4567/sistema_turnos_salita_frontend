import { useState } from 'react'
import { crearPaciente } from '../api/pacientesApi'
import { actualizarCampoAnidado } from '../utils/formUtils'
import CamposPaciente from './CamposPaciente'

const estadoInicial = {
  nombre: '',
  dni: '',
  direccion: { calle: '', numero: '', piso: '', departamento: '', barrio: '' },
  email: '',
  telefono: { tipo: 'CELULAR', codigoArea: '', numero: '' },
  obraSocial: { nombre: '', numeroAfiliado: '' },
}

function PacienteForm() {
  const [formData, setFormData] = useState(estadoInicial)
  const [errores, setErrores] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [pacienteCreado, setPacienteCreado] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => actualizarCampoAnidado(prev, name.split('.'), value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores([])
    setPacienteCreado(null)
    setEnviando(true)

    try {
      const paciente = await crearPaciente(formData)
      setPacienteCreado(paciente)
      setFormData(estadoInicial)
    } catch (error) {
      setErrores(error.errores?.length ? error.errores : [error.message])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="text-start" noValidate>
      {pacienteCreado && (
        <div className="alert alert-success" role="alert">
          Paciente <strong>{pacienteCreado.nombre}</strong> creado exitosamente
          (DNI {pacienteCreado.dni}).
        </div>
      )}

      {errores.length > 0 && (
        <div className="alert alert-danger" role="alert">
          <p className="fw-semibold mb-1">No se pudo crear el paciente:</p>
          <ul className="mb-0 ps-3">
            {errores.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <CamposPaciente valores={formData} onChange={handleChange} />

      <button type="submit" className="btn btn-primary mt-4" disabled={enviando}>
        {enviando ? 'Guardando...' : 'Dar de alta paciente'}
      </button>
    </form>
  )
}

export default PacienteForm
