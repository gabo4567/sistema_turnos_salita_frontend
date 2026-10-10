import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getPacientes, actualizarPaciente } from '../api/pacientesApi'
import { extraerMensaje, extraerMensajesError } from '../api/httpClient'
import { HistorialMedicoSchema, type HistorialMedicoFormValues } from '../schemas/historialMedico.schema'
import type { Paciente } from '../types/Paciente'

const entradaVacia: HistorialMedicoFormValues = { fecha: '', diagnostico: '', tratamiento: '', medico: '' }

function HistoriaClinicaPage() {
  const { dni } = useParams<{ dni: string }>()

  const [paciente, setPaciente] = useState<Paciente | null>(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [errores, setErrores] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HistorialMedicoFormValues>({
    resolver: zodResolver(HistorialMedicoSchema),
    defaultValues: entradaVacia,
  })

  useEffect(() => {
    if (!dni) return
    let cancelado = false

    getPacientes({ dni })
      .then((datos) => {
        if (cancelado) return
        if (!datos[0]) {
          setErrorCarga(`No se encontró ningún paciente con DNI ${dni}.`)
          return
        }
        setPaciente(datos[0])
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
  }, [dni])

  const onSubmit = async (datos: HistorialMedicoFormValues) => {
    setErrores([])

    try {
      if (!paciente) return
      const nuevaEntrada = { ...datos, fecha: new Date(datos.fecha).toISOString() }
      const actualizado = await actualizarPaciente(paciente.id, {
        historialMedico: [...paciente.historialMedico, nuevaEntrada],
      })
      setPaciente(actualizado)
      reset(entradaVacia)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Padrón</p>
      <h1 className="mb-2">Historia Clínica</h1>

      {paciente && (
        <div className="d-flex gap-3 mb-4">
          <Link to={`/pacientes/${dni}/editar`}>Editar datos</Link>
          <Link to="/pacientes">Volver a Pacientes</Link>
        </div>
      )}

      {cargando && <p className="text-body-secondary">Cargando datos del paciente...</p>}

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          {errorCarga}
        </div>
      )}

      {!cargando && paciente && (
        <>
          <div className="d-flex align-items-center justify-content-between border rounded p-3 mb-4">
            <span>
              <strong>{paciente.nombre}</strong> — DNI {paciente.dni}
            </span>
            <span className="text-body-secondary">
              {paciente.obraSocial?.nombre || 'Particular'}
            </span>
          </div>

          <h2 className="h5">Entradas registradas</h2>
          {paciente.historialMedico.length === 0 ? (
            <p className="text-body-secondary mb-4">Todavía no tiene entradas en su historial.</p>
          ) : (
            <div className="ledger mb-4">
              {[...paciente.historialMedico]
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .map((entrada, index) => (
                  <div className="ledger-row historial-row" key={entrada._id ?? index}>
                    <span className="fecha">
                      {new Date(entrada.fecha).toLocaleDateString('es-AR')}
                    </span>
                    <span>
                      <span className="diagnostico d-block">{entrada.diagnostico}</span>
                      <span className="detalle">
                        {entrada.tratamiento}
                        {entrada.medico && ` · ${entrada.medico}`}
                      </span>
                    </span>
                  </div>
                ))}
            </div>
          )}

          <h2 className="h5 mt-4">Agregar entrada</h2>

          {errores.length > 0 && (
            <div className="alert alert-danger" role="alert">
              <p className="fw-semibold mb-1">No se pudo guardar la entrada:</p>
              <ul className="mb-0 ps-3">
                {errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="fecha">
                  Fecha
                </label>
                <input
                  id="fecha"
                  type="datetime-local"
                  className={`form-control${errors.fecha ? ' is-invalid' : ''}`}
                  {...register('fecha')}
                />
                {errors.fecha && <div className="invalid-feedback">{errors.fecha.message}</div>}
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="medico">
                  Médico a cargo
                </label>
                <input
                  id="medico"
                  className={`form-control${errors.medico ? ' is-invalid' : ''}`}
                  {...register('medico')}
                />
                {errors.medico && <div className="invalid-feedback">{errors.medico.message}</div>}
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="diagnostico">
                  Diagnóstico
                </label>
                <input
                  id="diagnostico"
                  className={`form-control${errors.diagnostico ? ' is-invalid' : ''}`}
                  {...register('diagnostico')}
                />
                {errors.diagnostico && <div className="invalid-feedback">{errors.diagnostico.message}</div>}
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="tratamiento">
                  Tratamiento
                </label>
                <input
                  id="tratamiento"
                  className={`form-control${errors.tratamiento ? ' is-invalid' : ''}`}
                  {...register('tratamiento')}
                />
                {errors.tratamiento && <div className="invalid-feedback">{errors.tratamiento.message}</div>}
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Agregar al historial'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default HistoriaClinicaPage
