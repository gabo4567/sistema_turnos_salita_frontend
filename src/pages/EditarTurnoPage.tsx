import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getTurnoPorId, actualizarTurno } from '../api/turnosApi'
import { getMedicos } from '../api/medicosApi'
import { getConsultorios } from '../api/consultoriosApi'
import { extraerMensaje, extraerMensajesError } from '../api/httpClient'
import { ESPECIALIDADES } from '../constants/turnos'
import { useFetch } from '../hooks/useFetch'
import { useAutoDismiss } from '../hooks/useAutoDismiss'
import { EditarTurnoSchema, type EditarTurnoFormValues } from '../schemas/turno.schema'
import { obtenerFechaMinima } from '../utils/fecha'
import SelectorHorario from '../components/SelectorHorario'
import type { Turno } from '../types/Turno'
import type { Medico } from '../types/Medico'
import type { Consultorio } from '../types/Consultorio'

function EditarTurnoPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [turno, setTurno] = useState<Turno | null>(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [errores, setErrores] = useState<string[]>([])
  const [guardadoOk, setGuardadoOk] = useState(false)
  useAutoDismiss(guardadoOk, () => setGuardadoOk(false))

  const { datos: medicos, cargando: cargandoMedicos } = useFetch<Medico[]>(getMedicos)
  const { datos: consultorios, cargando: cargandoConsultorios } = useFetch<Consultorio[]>(getConsultorios)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditarTurnoFormValues>({
    resolver: zodResolver(EditarTurnoSchema),
  })

  const especialidad = watch('especialidad')
  const medicoElegido = watch('medico')
  const consultorioElegido = watch('consultorio')
  const fechaElegida = watch('fecha')
  const horaElegida = watch('hora')

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

  useEffect(() => {
    if (!id) return
    let cancelado = false

    getTurnoPorId(id)
      .then((datos) => {
        if (cancelado) return
        setTurno(datos)
        const fechaHora = new Date(datos.fechaTurno)
        const pad = (valor: number) => String(valor).padStart(2, '0')
        reset({
          especialidad: datos.especialidad,
          medico: datos.medico?.id ?? '',
          consultorio: datos.consultorio?.id ?? '',
          fecha: `${fechaHora.getFullYear()}-${pad(fechaHora.getMonth() + 1)}-${pad(fechaHora.getDate())}`,
          hora: `${pad(fechaHora.getHours())}:${pad(fechaHora.getMinutes())}`,
          observaciones: datos.observaciones ?? '',
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
  }, [id, reset])

  const onSubmit = async (datos: EditarTurnoFormValues) => {
    if (!id) return
    setErrores([])
    setGuardadoOk(false)

    try {
      const { fecha, hora, ...resto } = datos
      const fechaTurno = new Date(`${fecha}T${hora}:00`).toISOString()
      const turnoActualizado = await actualizarTurno(id, { ...resto, fechaTurno })
      setTurno(turnoActualizado)
      setGuardadoOk(true)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Agenda</p>
      <h1 className="mb-2">Editar Turno</h1>

      {!cargando && !errorCarga && (
        <div className="d-flex gap-3 mb-4">
          <Link to="/">Volver a Turnos</Link>
        </div>
      )}

      {cargando && <p className="text-body-secondary">Cargando datos del turno...</p>}

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          {errorCarga}{' '}
          <button type="button" className="btn btn-link p-0 align-baseline" onClick={() => navigate('/')}>
            Volver al listado
          </button>
        </div>
      )}

      {!cargando && !errorCarga && turno && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {guardadoOk && (
            <div className="alert alert-success" role="status">
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

          <h2 className="h5 mt-2">Paciente</h2>
          <div className="border rounded p-3 mb-3 text-body-secondary">
            <strong className="text-body">{turno.paciente?.nombre ?? 'Paciente sin datos'}</strong>
            {turno.paciente?.dni && ` — DNI ${turno.paciente.dni}`}
            <span className="d-block small">No se puede cambiar el paciente de un turno ya creado.</span>
          </div>

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
                disabled={cargandoMedicos}
                {...register('medico', { onChange: () => setValue('hora', '') })}
              >
                <option value="" disabled>
                  Seleccioná una opción
                </option>
                {medicosFiltrados.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} {m.apellido}
                  </option>
                ))}
              </select>
              {errors.medico && <div className="invalid-feedback">{errors.medico.message}</div>}
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
                excluirTurnoId={id}
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
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={() => navigate(-1)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default EditarTurnoPage
