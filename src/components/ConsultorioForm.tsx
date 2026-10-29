import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearConsultorio } from '../api/consultoriosApi'
import { extraerMensajesError } from '../api/httpClient'
import { useAutoDismiss } from '../hooks/useAutoDismiss'
import { ESPECIALIDADES } from '../constants/turnos'
import { ConsultorioSchema, type ConsultorioFormValues } from '../schemas/consultorio.schema'
import type { Consultorio } from '../types/Consultorio'

interface ConsultorioFormProps {
  onCreated?: (consultorio: Consultorio) => void
}

const valoresIniciales: ConsultorioFormValues = { numero: '', piso: '', especialidad: '' }

function ConsultorioForm({ onCreated }: ConsultorioFormProps) {
  const [errores, setErrores] = useState<string[]>([])
  const [consultorioCreado, setConsultorioCreado] = useState<Consultorio | null>(null)
  useAutoDismiss(consultorioCreado, () => setConsultorioCreado(null))

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
      onCreated?.(consultorio)
      reset(valoresIniciales)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-start" noValidate>
      {consultorioCreado && (
        <div className="alert alert-success" role="status">
          Consultorio <strong>{consultorioCreado.numero}</strong> agregado exitosamente.
        </div>
      )}
      {errores.length > 0 && (
        <div className="alert alert-danger" role="alert">
          <p className="fw-semibold mb-1">No se pudo crear el consultorio:</p>
          <ul className="mb-0 ps-3">{errores.map((error, index) => <li key={index}>{error}</li>)}</ul>
        </div>
      )}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="consultorio-numero">Número</label>
          <input id="consultorio-numero" className={`form-control${errors.numero ? ' is-invalid' : ''}`} {...register('numero')} />
          {errors.numero && <div className="invalid-feedback">{errors.numero.message}</div>}
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="consultorio-piso">Piso</label>
          <input id="consultorio-piso" className="form-control" {...register('piso')} />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="consultorio-especialidad">Especialidad</label>
          <select id="consultorio-especialidad" className="form-select" {...register('especialidad')}>
            <option value="">General</option>
            {ESPECIALIDADES.map((esp) => <option key={esp.valor} value={esp.valor}>{esp.etiqueta}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Agregar consultorio'}
      </button>
    </form>
  )
}

export default ConsultorioForm
