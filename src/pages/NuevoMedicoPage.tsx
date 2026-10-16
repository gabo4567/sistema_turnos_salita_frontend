import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearMedico } from '../api/medicosApi'
import { extraerMensajesError } from '../api/httpClient'
import { ESPECIALIDADES } from '../constants/turnos'
import { MedicoSchema, type MedicoFormValues } from '../schemas/medico.schema'
import type { Medico } from '../types/Medico'

const valoresIniciales: MedicoFormValues = {
  nombre: '',
  especialidad: '' as MedicoFormValues['especialidad'],
  matricula: '',
  telefono: '',
  cupoMaximo: 15,
}

function NuevoMedicoPage() {
  const [errores, setErrores] = useState<string[]>([])
  const [medicoCreado, setMedicoCreado] = useState<Medico | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicoFormValues>({
    resolver: zodResolver(MedicoSchema),
    defaultValues: valoresIniciales,
  })

  const onSubmit = async (datos: MedicoFormValues) => {
    setErrores([])
    setMedicoCreado(null)

    try {
      const medico = await crearMedico(datos)
      setMedicoCreado(medico)
      reset(valoresIniciales)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Cuerpo médico</p>
      <h1 className="mb-4">Nuevo Médico</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {medicoCreado && (
          <div className="alert alert-success" role="alert">
            Médico <strong>{medicoCreado.nombre}</strong> agregado exitosamente.
          </div>
        )}

        {errores.length > 0 && (
          <div className="alert alert-danger" role="alert">
            <p className="fw-semibold mb-1">No se pudo crear el médico:</p>
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
              Nombre completo
            </label>
            <input
              id="nombre"
              className={`form-control${errors.nombre ? ' is-invalid' : ''}`}
              {...register('nombre')}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
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
            <label className="form-label" htmlFor="especialidad">
              Especialidad
            </label>
            <select
              id="especialidad"
              className={`form-select${errors.especialidad ? ' is-invalid' : ''}`}
              {...register('especialidad')}
            >
              <option value="" disabled>
                Seleccioná una opción
              </option>
              {ESPECIALIDADES.map((esp) => (
                <option key={esp.valor} value={esp.valor}>
                  {esp.etiqueta}
                </option>
              ))}
            </select>
            {errors.especialidad && <div className="invalid-feedback">{errors.especialidad.message}</div>}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="telefono">
              Teléfono
            </label>
            <input id="telefono" className="form-control" {...register('telefono')} />
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
          {isSubmitting ? 'Guardando...' : 'Agregar médico'}
        </button>
      </form>
    </div>
  )
}

export default NuevoMedicoPage
