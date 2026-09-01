import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPacientes, actualizarPaciente } from '../api/pacientesApi'
import { actualizarCampoAnidado } from '../utils/formUtils'
import CamposPaciente from '../components/CamposPaciente'

function EditarPacientePage() {
  const { dni } = useParams()
  const navigate = useNavigate()

  const [pacienteId, setPacienteId] = useState(null)
  const [formData, setFormData] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)
  const [errores, setErrores] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [guardadoOk, setGuardadoOk] = useState(false)

  useEffect(() => {
    let cancelado = false

    getPacientes({ dni })
      .then((datos) => {
        if (cancelado) return
        const paciente = datos[0]
        if (!paciente) {
          setErrorCarga(`No se encontró ningún paciente con DNI ${dni}.`)
          return
        }
        setPacienteId(paciente.id)
        setFormData({
          nombre: paciente.nombre,
          dni: paciente.dni,
          direccion: { piso: '', departamento: '', barrio: '', ...paciente.direccion },
          email: paciente.email,
          telefono: paciente.telefono,
          obraSocial: { numeroAfiliado: '', ...paciente.obraSocial },
        })
      })
      .catch((err) => {
        if (!cancelado) setErrorCarga(err.message)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [dni])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => actualizarCampoAnidado(prev, name.split('.'), value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores([])
    setGuardadoOk(false)
    setEnviando(true)

    try {
      await actualizarPaciente(pacienteId, formData)
      setGuardadoOk(true)
    } catch (error) {
      setErrores(error.errores?.length ? error.errores : [error.message])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Padrón</p>
      <h1 className="mb-2">Editar Paciente</h1>

      {!cargando && !errorCarga && (
        <div className="d-flex gap-3 mb-4">
          <Link to={`/pacientes/${dni}/historia`}>Historia clínica</Link>
          <Link to="/pacientes">Volver a Pacientes</Link>
        </div>
      )}

      {cargando && <p className="text-body-secondary">Cargando datos del paciente...</p>}

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          {errorCarga}{' '}
          <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => navigate('/pacientes')}>
            Volver al listado
          </button>
        </div>
      )}

      {!cargando && formData && (
        <form onSubmit={handleSubmit} noValidate>
          {guardadoOk && (
            <div className="alert alert-success" role="alert">
              Cambios guardados correctamente.
            </div>
          )}

          {errores.length > 0 && (
            <div className="alert alert-danger" role="alert">
              <p className="fw-semibold mb-1">No se pudo guardar:</p>
              <ul className="mb-0 ps-3">
                {errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <CamposPaciente valores={formData} onChange={handleChange} />

          <button type="submit" className="btn btn-primary mt-4" disabled={enviando}>
            {enviando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      )}
    </div>
  )
}

export default EditarPacientePage
