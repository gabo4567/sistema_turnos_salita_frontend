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
  apellido: '',
  especialidades: [],
  matricula: '',
  telefono: '',
  cupoMaximo: 15,
  email: '',
  password: '',
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
            Médico <strong>{medicoCreado.nombre} {medicoCreado.apellido}</strong> agregado exitosamente.
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

          <div className="col-12">
            <hr />
            <p className="text-body-secondary mb-2">Cuenta de acceso del médico</p>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`form-control${errors.email ? ' is-invalid' : ''}`}
              {...register('email')}
            />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className={`form-control${errors.password ? ' is-invalid' : ''}`}
              {...register('password')}
            />
            {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
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
