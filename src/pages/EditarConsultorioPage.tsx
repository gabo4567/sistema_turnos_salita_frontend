import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getConsultorios, actualizarConsultorio } from '../api/consultoriosApi'
import { extraerMensaje, extraerMensajesError } from '../api/httpClient'
import { ESPECIALIDADES } from '../constants/turnos'
import { ConsultorioSchema, type ConsultorioFormValues } from '../schemas/consultorio.schema'

function EditarConsultorioPage() {
  const { numero } = useParams<{ numero: string }>()
  const navigate = useNavigate()

  const [consultorioId, setConsultorioId] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [errores, setErrores] = useState<string[]>([])
  const [guardadoOk, setGuardadoOk] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsultorioFormValues>({
    resolver: zodResolver(ConsultorioSchema),
  })

  useEffect(() => {
    if (!numero) return
    let cancelado = false

    getConsultorios({ estado: 'todos' })
      .then((datos) => {
        if (cancelado) return
        const consultorio = datos.find((c) => c.numero === numero)
        if (!consultorio) {
          setErrorCarga(`No se encontró ningún consultorio con número ${numero}.`)
          return
        }
        setConsultorioId(consultorio.id)
        reset({
          numero: consultorio.numero,
          piso: consultorio.piso || '',
          especialidad: consultorio.especialidad || '',
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
  }, [numero, reset])

  const onSubmit = async (datos: ConsultorioFormValues) => {
    setErrores([])
    setGuardadoOk(false)

    try {
      if (!consultorioId) return
      await actualizarConsultorio(consultorioId, datos)
      setGuardadoOk(true)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Infraestructura</p>
      <h1 className="mb-2">Editar Consultorio</h1>

      {!cargando && !errorCarga && (
        <div className="d-flex gap-3 mb-4">
          <Link to="/consultorios">Volver a Consultorios</Link>
        </div>
      )}

      {cargando && <p className="text-body-secondary">Cargando datos del consultorio...</p>}

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          {errorCarga}{' '}
          <button
            type="button"
            className="btn btn-link p-0 align-baseline"
            onClick={() => navigate('/consultorios')}
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
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="numero">
                Número
              </label>
              <input
                id="numero"
                className={`form-control${errors.numero ? ' is-invalid' : ''}`}
                {...register('numero')}
              />
              {errors.numero && <div className="invalid-feedback">{errors.numero.message}</div>}
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="piso">
                Piso
              </label>
              <input id="piso" className="form-control" {...register('piso')} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="especialidad">
                Especialidad
              </label>
              <select id="especialidad" className="form-select" {...register('especialidad')}>
                <option value="">General</option>
                {ESPECIALIDADES.map((esp) => (
                  <option key={esp.valor} value={esp.valor}>
                    {esp.etiqueta}
                  </option>
                ))}
              </select>
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

export default EditarConsultorioPage
