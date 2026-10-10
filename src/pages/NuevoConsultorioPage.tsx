import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearConsultorio } from '../api/consultoriosApi'
import { extraerMensajesError } from '../api/httpClient'
import { ESPECIALIDADES } from '../constants/turnos'
import { ConsultorioSchema, type ConsultorioFormValues } from '../schemas/consultorio.schema'
import type { Consultorio } from '../types/Consultorio'

const valoresIniciales: ConsultorioFormValues = { numero: '', piso: '', especialidad: '' }

function NuevoConsultorioPage() {
  const [errores, setErrores] = useState<string[]>([])
  const [consultorioCreado, setConsultorioCreado] = useState<Consultorio | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsultorioFormValues>({
    resolver: zodResolver(ConsultorioSchema),
    defaultValues: valoresIniciales,
  })

  const onSubmit = async (datos: ConsultorioFormValues) => {
    setErrores([])
    setConsultorioCreado(null)

    try {
      const consultorio = await crearConsultorio(datos)
      setConsultorioCreado(consultorio)
      reset(valoresIniciales)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Infraestructura</p>
      <h1 className="mb-4">Nuevo Consultorio</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {consultorioCreado && (
          <div className="alert alert-success" role="alert">
            Consultorio <strong>{consultorioCreado.numero}</strong> agregado exitosamente.
          </div>
        )}

        {errores.length > 0 && (
          <div className="alert alert-danger" role="alert">
            <p className="fw-semibold mb-1">No se pudo crear el consultorio:</p>
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
          {isSubmitting ? 'Guardando...' : 'Agregar consultorio'}
        </button>
      </form>
    </div>
  )
}

export default NuevoConsultorioPage
