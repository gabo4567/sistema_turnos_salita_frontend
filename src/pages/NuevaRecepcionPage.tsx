import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearRecepcion, type NuevaRecepcionPayload } from '../api/recepcionApi'
import { getMedicos } from '../api/medicosApi'
import { getConsultorios } from '../api/consultoriosApi'
import { extraerMensajesError } from '../api/httpClient'
import CamposPaciente from '../components/CamposPaciente'
import { ESPECIALIDADES } from '../constants/turnos'
import { useFetch } from '../hooks/useFetch'
import { RecepcionSchema, type RecepcionFormValues } from '../schemas/recepcion.schema'
import { obtenerFechaMinima } from '../utils/fecha'
import SelectorHorario from '../components/SelectorHorario'
import type { Medico } from '../types/Medico'
import type { Consultorio } from '../types/Consultorio'
import type { Turno } from '../types/Turno'

const valoresIniciales: RecepcionFormValues = {
  datosPaciente: {
    nombre: '',
    dni: '',
    direccion: { calle: '', numero: '', piso: '', departamento: '', barrio: '' },
    email: '',
    telefono: { tipo: 'CELULAR', codigoArea: '', numero: '' },
    obraSocial: { nombre: '' as RecepcionFormValues['datosPaciente']['obraSocial']['nombre'], numeroAfiliado: '' },
  },
  especialidad: '' as RecepcionFormValues['especialidad'],
  medico: '',
  consultorio: '',
  fecha: '',
  hora: '',
  observaciones: '',
}

function NuevaRecepcionPage() {
  const navigate = useNavigate()
  const [errores, setErrores] = useState<string[]>([])
  const [turnoCreado, setTurnoCreado] = useState<Turno | null>(null)

  const { datos: medicos, cargando: cargandoMedicos } = useFetch<Medico[]>(getMedicos)
  const { datos: consultorios, cargando: cargandoConsultorios } = useFetch<Consultorio[]>(getConsultorios)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RecepcionFormValues>({
    resolver: zodResolver(RecepcionSchema),
    defaultValues: valoresIniciales,
  })

  const especialidad = watch('especialidad')
  const medicoElegido = watch('medico')
  const fechaElegida = watch('fecha')
  const horaElegida = watch('hora')

  const medicosFiltrados = (medicos ?? []).filter((m) => !especialidad || m.especialidades.includes(especialidad))

  useEffect(() => {
    if (medicosFiltrados.length === 1 && medicoElegido !== medicosFiltrados[0].id) {
      setValue('medico', medicosFiltrados[0].id, { shouldValidate: true })
    }
  }, [medicoElegido, medicosFiltrados, setValue])

  const onSubmit = async (datos: RecepcionFormValues) => {
    setErrores([])
    setTurnoCreado(null)

    try {
      const { consultorio, fecha, hora, ...resto } = datos
      const payload: NuevaRecepcionPayload = {
        ...resto,
        fechaTurno: new Date(`${fecha}T${hora}:00`).toISOString(),
      }
      if (consultorio) payload.consultorio = consultorio

      const turno = await crearRecepcion(payload)
      setTurnoCreado(turno)
      reset(valoresIniciales)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Recepción</p>
      <h1 className="mb-4">Nueva Recepción</h1>
      <p className="text-body-secondary mb-4">
        Da de alta un paciente y le agenda un turno en un mismo paso.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {turnoCreado && (
          <div className="alert alert-success" role="alert">
            Turno agendado para <strong>{turnoCreado.paciente.nombre}</strong> con{' '}
            {turnoCreado.medico ? `${turnoCreado.medico.nombre} ${turnoCreado.medico.apellido}` : 'el médico asignado'}
            {turnoCreado.consultorio && ` en el consultorio ${turnoCreado.consultorio.numero}`} (
            {ESPECIALIDADES.find((e) => e.valor === turnoCreado.especialidad)?.etiqueta} —{' '}
            {new Date(turnoCreado.fechaTurno).toLocaleString('es-AR')}).
          </div>
        )}

        {errores.length > 0 && (
          <div className="alert alert-danger" role="alert">
            <p className="fw-semibold mb-1">No se pudo registrar la recepción:</p>
            <ul className="mb-0 ps-3">
              {errores.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <CamposPaciente register={register} errors={errors} prefix="datosPaciente." />

        <h2 className="h5 mt-4">Turno</h2>
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
              {ESPECIALIDADES.map((especialidad) => (
                <option key={especialidad.valor} value={especialidad.valor}>
                  {especialidad.etiqueta}
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
              {...register('medico', { onChange: () => setValue('hora', '') })}
            >
              <option value="" disabled>
                {especialidad ? 'Seleccioná una opción' : 'Elegí primero una especialidad'}
              </option>
              {medicosFiltrados.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} {m.apellido}
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
            <label className="form-label" htmlFor="fecha">
              Fecha
            </label>
            <input
              id="fecha"
              type="date"
              min={obtenerFechaMinima()}
              className={`form-control${errors.fecha ? ' is-invalid' : ''}`}
              {...register('fecha', { onChange: () => setValue('hora', '') })}
            />
            {errors.fecha && <div className="invalid-feedback">{errors.fecha.message}</div>}
          </div>
          <div className="col-12">
            <label className="form-label d-block">Horario</label>
            <input type="hidden" {...register('hora')} />
            <SelectorHorario
              medicoId={medicoElegido}
              fecha={fechaElegida}
              horaSeleccionada={horaElegida}
              onSeleccionar={(hora) => setValue('hora', hora, { shouldValidate: true })}
              error={errors.hora?.message}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="observaciones">
              Motivo (opcional)
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

        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Registrar recepción'}
          </button>
          <button type="button" className="btn btn-outline-danger" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default NuevaRecepcionPage
