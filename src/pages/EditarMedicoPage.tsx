import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getMedicos, actualizarMedico } from '../api/medicosApi'
import { extraerMensaje, extraerMensajesError } from '../api/httpClient'
import { ESPECIALIDADES } from '../constants/turnos'
import { ActualizarMedicoSchema, type ActualizarMedicoFormValues } from '../schemas/medico.schema'

function EditarMedicoPage() {
  const { matricula } = useParams<{ matricula: string }>()
  const navigate = useNavigate()

  const [medicoId, setMedicoId] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [errores, setErrores] = useState<string[]>([])
  const [guardadoOk, setGuardadoOk] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActualizarMedicoFormValues>({
    resolver: zodResolver(ActualizarMedicoSchema),
  })

  useEffect(() => {
    if (!matricula) return
    let cancelado = false

    getMedicos({ estado: 'todos' })
      .then((datos) => {
        if (cancelado) return
        const medico = datos.find((m) => m.matricula === matricula)
        if (!medico) {
          setErrorCarga(`No se encontró ningún médico con matrícula ${matricula}.`)
          return
        }
        setMedicoId(medico.id)
        reset({
          nombre: medico.nombre,
          apellido: medico.apellido,
          matricula: medico.matricula,
          especialidades: medico.especialidades,
          telefono: medico.telefono || '',
          cupoMaximo: medico.cupoMaximo,
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
  }, [matricula, reset])

  const onSubmit = async (datos: ActualizarMedicoFormValues) => {
    setErrores([])
    setGuardadoOk(false)

    try {
      if (!medicoId) return
      await actualizarMedico(medicoId, datos)
      setGuardadoOk(true)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Cuerpo médico</p>
      <h1 className="mb-2">Editar Médico</h1>

      {!cargando && !errorCarga && (
        <div className="d-flex gap-3 mb-4">
          <Link to="/medicos">Volver a Médicos</Link>
        </div>
      )}

      {cargando && <p className="text-body-secondary">Cargando datos del médico...</p>}

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          {errorCarga}{' '}
          <button
            type="button"
            className="btn btn-link p-0 align-baseline"
            onClick={() => navigate('/medicos')}
          >
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

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="nombre">
                Nombre
              </label>
              <input
                id="nombre"
                className={`form-control${errors.nombre ? ' is-invalid' : ''}`}
                {...register('nombre')}
              />
              {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="apellido">
                Apellido
              </label>
              <input
                id="apellido"
                className={`form-control${errors.apellido ? ' is-invalid' : ''}`}
                {...register('apellido')}
              />
              {errors.apellido && <div className="invalid-feedback">{errors.apellido.message}</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="matricula">
                Matrícula
              </label>
              <input
                id="matricula"
                className={`form-control${errors.matricula ? ' is-invalid' : ''}`}
                {...register('matricula')}
              />
              {errors.matricula && <div className="invalid-feedback">{errors.matricula.message}</div>}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="telefono">
                Teléfono
              </label>
              <input id="telefono" className="form-control" {...register('telefono')} />
            </div>
            <div className="col-12">
              <label className="form-label d-block">Especialidades</label>
              <div className="d-flex flex-wrap gap-3">
                {ESPECIALIDADES.map((esp) => (
                  <div className="form-check" key={esp.valor}>
                    <input
                      type="checkbox"
                      id={`especialidad-${esp.valor}`}
                      className="form-check-input"
                      value={esp.valor}
                      {...register('especialidades')}
                    />
                    <label className="form-check-label" htmlFor={`especialidad-${esp.valor}`}>
                      {esp.etiqueta}
                    </label>
                  </div>
                ))}
              </div>
              {errors.especialidades && (
                <div className="text-danger small mt-1">{errors.especialidades.message}</div>
              )}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="cupoMaximo">
                Cupo máximo de turnos por día
              </label>
              <input
                id="cupoMaximo"
                type="number"
                min={1}
                className={`form-control${errors.cupoMaximo ? ' is-invalid' : ''}`}
                {...register('cupoMaximo', { valueAsNumber: true })}
              />
              {errors.cupoMaximo && <div className="invalid-feedback">{errors.cupoMaximo.message}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      )}
    </div>
  )
}

export default EditarMedicoPage
