import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getMedicos } from '../api/medicosApi'
import { getConsultorios } from '../api/consultoriosApi'
import { crearTurno } from '../api/turnosApi'
import { extraerMensajesError } from '../api/httpClient'
import { ESPECIALIDADES } from '../constants/turnos'
import { useFetch } from '../hooks/useFetch'
import { PedirTurnoSchema, type PedirTurnoFormValues } from '../schemas/turno.schema'
import type { Medico } from '../types/Medico'
import type { Consultorio } from '../types/Consultorio'

interface TurnoConfirmadoResumen {
  especialidad: PedirTurnoFormValues['especialidad'] | ''
  fechaTurno: string
  medico?: Medico
  consultorio?: Consultorio
}

const valoresIniciales: PedirTurnoFormValues = {
  especialidad: '' as PedirTurnoFormValues['especialidad'],
  medico: '',
  consultorio: '',
  fechaTurno: '',
  observaciones: '',
}

function PedirTurnoPage() {
  const { datos: medicos, cargando: cargandoMedicos } = useFetch<Medico[]>(getMedicos)
  const { datos: consultorios, cargando: cargandoConsultorios } = useFetch<Consultorio[]>(getConsultorios)

  const [errores, setErrores] = useState<string[]>([])
  const [turnoConfirmado, setTurnoConfirmado] = useState<TurnoConfirmadoResumen | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PedirTurnoFormValues>({
    resolver: zodResolver(PedirTurnoSchema),
    defaultValues: valoresIniciales,
  })

  const especialidad = watch('especialidad')

  const medicosFiltrados = (medicos ?? []).filter(
    (m) => !especialidad || m.especialidad === especialidad
  )

  const onSubmit = async (datos: PedirTurnoFormValues) => {
    setErrores([])
    setTurnoConfirmado(null)

    try {
      // El backend ignora este valor y usa el paciente logueado; se manda
      // un id cualquiera no vacío solo para que pase la validación del body.
      await crearTurno({
        ...datos,
        paciente: 'paciente-logueado',
        fechaTurno: new Date(datos.fechaTurno).toISOString(),
      })
      setTurnoConfirmado({
        especialidad: datos.especialidad,
        fechaTurno: datos.fechaTurno,
        medico: medicos?.find((m) => m.id === datos.medico),
        consultorio: consultorios?.find((c) => c.id === datos.consultorio),
      })
      reset(valoresIniciales)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Mi cuenta</p>
      <h1 className="mb-4">Pedir Turno</h1>

      {turnoConfirmado && (
        <div className="alert alert-success" role="alert">
          Turno agendado con {turnoConfirmado.medico?.nombre ?? 'el médico asignado'}
          {turnoConfirmado.consultorio && ` en el consultorio ${turnoConfirmado.consultorio.numero}`} (
          {ESPECIALIDADES.find((e) => e.valor === turnoConfirmado.especialidad)?.etiqueta} —{' '}
          {new Date(turnoConfirmado.fechaTurno).toLocaleString('es-AR')}).
        </div>
      )}

      {errores.length > 0 && (
        <div className="alert alert-danger" role="alert">
          <p className="fw-semibold mb-1">No se pudo agendar el turno:</p>
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
            <label className="form-label" htmlFor="especialidad">
              Especialidad
            </label>
            <select
              id="especialidad"
              className={`form-select${errors.especialidad ? ' is-invalid' : ''}`}
              {...register('especialidad', { onChange: () => setValue('medico', '') })}
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
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="medico">
              Médico
            </label>
            <select
              id="medico"
              className={`form-select${errors.medico ? ' is-invalid' : ''}`}
              disabled={cargandoMedicos || !especialidad}
              {...register('medico')}
            >
              <option value="" disabled>
                {especialidad ? 'Seleccioná una opción' : 'Elegí primero una especialidad'}
              </option>
              {medicosFiltrados.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
            {errors.medico && <div className="invalid-feedback">{errors.medico.message}</div>}
            {especialidad && medicosFiltrados.length === 0 && (
              <div className="form-text text-danger">
                No hay médicos cargados para esta especialidad.
              </div>
            )}
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="consultorio">
              Consultorio
            </label>
            <select
              id="consultorio"
              className="form-select"
              disabled={cargandoConsultorios}
              {...register('consultorio')}
            >
              <option value="">Sin asignar</option>
              {(consultorios ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  Consultorio {c.numero}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="fechaTurno">
              Fecha y hora
            </label>
            <input
              id="fechaTurno"
              type="datetime-local"
              step={1800}
              className={`form-control${errors.fechaTurno ? ' is-invalid' : ''}`}
              {...register('fechaTurno')}
            />
            {errors.fechaTurno && <div className="invalid-feedback">{errors.fechaTurno.message}</div>}
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="observaciones">
              Observaciones
            </label>
            <textarea
              id="observaciones"
              className={`form-control${errors.observaciones ? ' is-invalid' : ''}`}
              maxLength={500}
              rows={3}
              {...register('observaciones')}
            />
            {errors.observaciones && <div className="invalid-feedback">{errors.observaciones.message}</div>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Pedir turno'}
        </button>
      </form>
    </div>
  )
}

export default PedirTurnoPage
