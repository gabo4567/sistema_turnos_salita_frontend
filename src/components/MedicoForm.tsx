import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearMedico } from '../api/medicosApi'
import { extraerMensajesError } from '../api/httpClient'
import { useAutoDismiss } from '../hooks/useAutoDismiss'
import { ESPECIALIDADES } from '../constants/turnos'
import { MedicoSchema, type MedicoFormValues } from '../schemas/medico.schema'
import type { Medico } from '../types/Medico'

interface MedicoFormProps {
  onCreated?: (medico: Medico) => void
}

const valoresIniciales: MedicoFormValues = {
  nombre: '',
  apellido: '',
  especialidades: [],
  matricula: '',
  telefono: '',
  cupoMaximo: 15,
  email: '',
  password: '',
}

function MedicoForm({ onCreated }: MedicoFormProps) {
  const [errores, setErrores] = useState<string[]>([])
  const [medicoCreado, setMedicoCreado] = useState<Medico | null>(null)
  useAutoDismiss(medicoCreado, () => setMedicoCreado(null))

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
      onCreated?.(medico)
      reset(valoresIniciales)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-start" noValidate>
      {medicoCreado && (
        <div className="alert alert-success" role="status">
          Médico <strong>{medicoCreado.nombre} {medicoCreado.apellido}</strong> agregado exitosamente.
        </div>
      )}

      {errores.length > 0 && (
        <div className="alert alert-danger" role="alert">
          <p className="fw-semibold mb-1">No se pudo crear el médico:</p>
          <ul className="mb-0 ps-3">
            {errores.map((error, index) => <li key={index}>{error}</li>)}
          </ul>
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="medico-nombre">Nombre</label>
          <input id="medico-nombre" className={`form-control${errors.nombre ? ' is-invalid' : ''}`} {...register('nombre')} />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="medico-apellido">Apellido</label>
          <input id="medico-apellido" className={`form-control${errors.apellido ? ' is-invalid' : ''}`} {...register('apellido')} />
          {errors.apellido && <div className="invalid-feedback">{errors.apellido.message}</div>}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="medico-matricula">Matrícula</label>
          <input id="medico-matricula" className={`form-control${errors.matricula ? ' is-invalid' : ''}`} {...register('matricula')} />
          {errors.matricula && <div className="invalid-feedback">{errors.matricula.message}</div>}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="medico-telefono">Teléfono</label>
          <input id="medico-telefono" className="form-control" {...register('telefono')} />
        </div>
        <div className="col-12">
          <label className="form-label d-block">Especialidades</label>
          <div className="d-flex flex-wrap gap-3">
            {ESPECIALIDADES.map((esp) => (
              <div className="form-check" key={esp.valor}>
                <input
                  type="checkbox"
                  id={`medico-especialidad-${esp.valor}`}
                  className="form-check-input"
                  value={esp.valor}
                  {...register('especialidades')}
                />
                <label className="form-check-label" htmlFor={`medico-especialidad-${esp.valor}`}>
                  {esp.etiqueta}
                </label>
              </div>
            ))}
          </div>
          {errors.especialidades && <div className="text-danger small mt-1">{errors.especialidades.message}</div>}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="medico-cupoMaximo">Cupo máximo de turnos por día</label>
          <input
            id="medico-cupoMaximo"
            type="number"
            min={1}
            className={`form-control${errors.cupoMaximo ? ' is-invalid' : ''}`}
            {...register('cupoMaximo', { valueAsNumber: true })}
          />
          {errors.cupoMaximo && <div className="invalid-feedback">{errors.cupoMaximo.message}</div>}
        </div>
        <div className="col-12"><hr /><p className="text-body-secondary mb-2">Cuenta de acceso del médico</p></div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="medico-email">Email</label>
          <input id="medico-email" type="email" className={`form-control${errors.email ? ' is-invalid' : ''}`} {...register('email')} />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="medico-password">Contraseña</label>
          <input id="medico-password" type="password" className={`form-control${errors.password ? ' is-invalid' : ''}`} {...register('password')} />
          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Agregar médico'}
      </button>
    </form>
  )
}

export default MedicoForm
