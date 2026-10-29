import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getPacientes } from '../api/pacientesApi'
import { getMedicos } from '../api/medicosApi'
import { getConsultorios } from '../api/consultoriosApi'
import { crearTurno } from '../api/turnosApi'
import { extraerMensaje, extraerMensajesError } from '../api/httpClient'
import { ESPECIALIDADES } from '../constants/turnos'
import { useFetch } from '../hooks/useFetch'
import { useAutoDismiss } from '../hooks/useAutoDismiss'
import { TurnoSchema, type TurnoFormValues } from '../schemas/turno.schema'
import { obtenerFechaMinima } from '../utils/fecha'
import SelectorHorario from '../components/SelectorHorario'
import type { Paciente } from '../types/Paciente'
import type { Medico } from '../types/Medico'
import type { Consultorio } from '../types/Consultorio'

interface TurnoCreadoResumen {
  paciente: Paciente
  especialidad: TurnoFormValues['especialidad'] | ''
  fechaTurno: string
  medico?: Medico
  consultorio?: Consultorio
}

const valoresIniciales: TurnoFormValues = {
  paciente: '',
  especialidad: '' as TurnoFormValues['especialidad'],
  medico: '',
  consultorio: '',
  fecha: '',
  hora: '',
  observaciones: '',
}

function NuevoTurnoPage() {
  const navigate = useNavigate()
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [cargandoPacientes, setCargandoPacientes] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)

  const { datos: medicos, cargando: cargandoMedicos } = useFetch<Medico[]>(getMedicos)
  const { datos: consultorios, cargando: cargandoConsultorios } = useFetch<Consultorio[]>(getConsultorios)

  const [busqueda, setBusqueda] = useState('')
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null)

  const [errores, setErrores] = useState<string[]>([])
  const [turnoCreado, setTurnoCreado] = useState<TurnoCreadoResumen | null>(null)
  useAutoDismiss(turnoCreado, () => setTurnoCreado(null))

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TurnoFormValues>({
    resolver: zodResolver(TurnoSchema),
    defaultValues: valoresIniciales,
  })

  const especialidad = watch('especialidad')
  const medicoElegido = watch('medico')
  const consultorioElegido = watch('consultorio')
  const fechaElegida = watch('fecha')
  const horaElegida = watch('hora')

  useEffect(() => {
    getPacientes()
      .then(setPacientes)
      .catch((err) => setErrorCarga(extraerMensaje(err)))
      .finally(() => setCargandoPacientes(false))
  }, [])

  // Ordenados alfabéticamente por apellido: al elegir especialidad, siempre
  // se auto-selecciona el primero de la lista (no solo cuando hay uno solo),
  // para que recepción no tenga que elegir médico y consultorio a mano.
  const medicosFiltrados = (medicos ?? [])
    .filter((m) => !especialidad || m.especialidades.includes(especialidad))
    .sort((a, b) => a.apellido.localeCompare(b.apellido) || a.nombre.localeCompare(b.nombre))

  // Los consultorios "General" (sin especialidad propia) quedan como respaldo:
  // matchean cualquier especialidad, pero se ordenan después de los que son
  // específicamente de esa especialidad, para que el auto-select prefiera
  // siempre un consultorio específico antes que uno general.
  const consultoriosFiltrados = (consultorios ?? [])
    .filter((c) => !especialidad || c.especialidad === especialidad || !c.especialidad)
    .sort((a, b) => {
      const prioridadA = a.especialidad === especialidad ? 0 : 1
      const prioridadB = b.especialidad === especialidad ? 0 : 1
      return prioridadA - prioridadB || a.numero.localeCompare(b.numero)
    })

  useEffect(() => {
    if (especialidad && !medicoElegido && medicosFiltrados.length > 0) {
      setValue('medico', medicosFiltrados[0].id, { shouldValidate: true })
    }
  }, [especialidad, medicoElegido, medicosFiltrados, setValue])

  useEffect(() => {
    if (especialidad && !consultorioElegido && consultoriosFiltrados.length > 0) {
      setValue('consultorio', consultoriosFiltrados[0].id, { shouldValidate: true })
    }
  }, [especialidad, consultorioElegido, consultoriosFiltrados, setValue])

  const coincidencias =
    busqueda.trim() === ''
      ? []
      : pacientes
          .filter(
            (p) =>
              p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.dni.includes(busqueda)
          )
          .slice(0, 8)

  const seleccionarPaciente = (paciente: Paciente) => {
    setPacienteSeleccionado(paciente)
    setValue('paciente', paciente.id, { shouldValidate: true })
    setBusqueda('')
  }

  const quitarPaciente = () => {
    setPacienteSeleccionado(null)
    setValue('paciente', '')
  }

  const onSubmit = async (datos: TurnoFormValues) => {
    setErrores([])
    setTurnoCreado(null)

    try {
      if (!pacienteSeleccionado) return

      const { fecha, hora, ...resto } = datos
      const fechaTurno = new Date(`${fecha}T${hora}:00`).toISOString()

      await crearTurno({ ...resto, fechaTurno })
      setTurnoCreado({
        paciente: pacienteSeleccionado,
        especialidad: datos.especialidad,
        fechaTurno,
        medico: medicos?.find((m) => m.id === datos.medico),
        consultorio: consultorios?.find((c) => c.id === datos.consultorio),
      })
      setPacienteSeleccionado(null)
      reset(valoresIniciales)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Agenda</p>
      <h1 className="mb-4">Nuevo Turno</h1>
      <p className="text-body-secondary mb-4">
        Agendá un turno para un paciente que ya está en el padrón.
      </p>

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          {errorCarga}
        </div>
      )}

      {turnoCreado && (
        <div className="alert alert-success" role="alert">
          Turno agendado para <strong>{turnoCreado.paciente.nombre}</strong> con{' '}
          {turnoCreado.medico
            ? `${turnoCreado.medico.nombre} ${turnoCreado.medico.apellido}`
            : 'el médico asignado'}
          {turnoCreado.consultorio && ` en el consultorio ${turnoCreado.consultorio.numero}`} (
          {ESPECIALIDADES.find((e) => e.valor === turnoCreado.especialidad)?.etiqueta} —{' '}
          {new Date(turnoCreado.fechaTurno).toLocaleString('es-AR')}).
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
        <h2 className="h5 mt-2">Paciente</h2>

        <input type="hidden" {...register('paciente')} />

        {pacienteSeleccionado ? (
          <div className="d-flex align-items-center justify-content-between border rounded p-3 mb-3">
            <span>
              <strong>{pacienteSeleccionado.nombre}</strong> — DNI {pacienteSeleccionado.dni}
            </span>
            <button type="button" className="btn btn-link btn-sm" onClick={quitarPaciente}>
              Cambiar
            </button>
          </div>
        ) : (
          <div className="mb-3">
            <input
              type="text"
              className={`form-control${errors.paciente ? ' is-invalid' : ''}`}
              placeholder="Buscar paciente por nombre o DNI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              disabled={cargandoPacientes}
            />
            {errors.paciente && <div className="invalid-feedback">{errors.paciente.message}</div>}
            {coincidencias.length > 0 && (
              <div className="border rounded mt-2">
                {coincidencias.map((paciente) => (
                  <button
                    type="button"
                    key={paciente.id}
                    className="d-block w-100 text-start btn btn-light border-0 rounded-0"
                    onClick={() => seleccionarPaciente(paciente)}
                  >
                    {paciente.nombre} — DNI {paciente.dni}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <h2 className="h5 mt-4">Turno</h2>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="especialidad">
              Especialidad
            </label>
            <select
              id="especialidad"
              className={`form-select${errors.especialidad ? ' is-invalid' : ''}`}
              {...register('especialidad', {
                onChange: () => {
                  setValue('medico', '')
                  setValue('consultorio', '')
                  setValue('hora', '')
                },
              })}
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
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !pacienteSeleccionado}
          >
            {isSubmitting ? 'Guardando...' : 'Agendar turno'}
          </button>
          <button type="button" className="btn btn-outline-danger" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default NuevoTurnoPage
