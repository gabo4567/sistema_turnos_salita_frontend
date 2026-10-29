import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getPacientes, actualizarPaciente } from '../api/pacientesApi'
import { extraerMensaje, extraerMensajesError } from '../api/httpClient'
import CamposPaciente from '../components/CamposPaciente'
import { PacienteSchema, type PacienteFormValues } from '../schemas/paciente.schema'

function EditarPacientePage() {
  const { dni } = useParams<{ dni: string }>()
  const navigate = useNavigate()

  const [pacienteId, setPacienteId] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [errores, setErrores] = useState<string[]>([])
  const [guardadoOk, setGuardadoOk] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PacienteFormValues>({
    resolver: zodResolver(PacienteSchema),
  })

  useEffect(() => {
    if (!dni) return
    let cancelado = false

    getPacientes({ dni, estado: 'todos' })
      .then((datos) => {
        if (cancelado) return
        const paciente = datos[0]
        if (!paciente) {
          setErrorCarga(`No se encontró ningún paciente con DNI ${dni}.`)
          return
        }
        setPacienteId(paciente.id)
        reset({
          nombre: paciente.nombre,
          dni: paciente.dni,
          direccion: { piso: '', departamento: '', barrio: '', ...paciente.direccion },
          email: paciente.email,
          telefono: paciente.telefono,
          obraSocial: { numeroAfiliado: '', ...paciente.obraSocial },
        })
      })
      .catch((err) => {
        if (!cancelado) setErrorCarga(extraerMensaje(err))
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [dni, reset])

  const onSubmit = async (datos: PacienteFormValues) => {
    setErrores([])
    setGuardadoOk(false)

    try {
      if (!pacienteId) return
      await actualizarPaciente(pacienteId, datos)
      setGuardadoOk(true)
    } catch (error) {
      setErrores(extraerMensajesError(error))
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

      {!cargando && !errorCarga && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

          <CamposPaciente register={register} errors={errors} />

          <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      )}
    </div>
  )
}

export default EditarPacientePage
