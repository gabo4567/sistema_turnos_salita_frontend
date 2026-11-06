import { useEffect, useRef, useState } from 'react'
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
import { useAutoDismiss } from '../hooks/useAutoDismiss'
import { RecepcionSchema, type RecepcionFormValues } from '../schemas/recepcion.schema'
import { obtenerFechaMinima } from '../utils/fecha'
import SelectorHorario from '../components/SelectorHorario'
import BuscadorSelect from '../components/BuscadorSelect'
import type { Medico } from '../types/Medico'
import type { Consultorio } from '../types/Consultorio'
import type { Turno } from '../types/Turno'
import { nombreCompleto } from '../utils/texto'

const valoresIniciales: RecepcionFormValues = {
  datosPaciente: {
    nombre: '',
    apellido: '',
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
  useAutoDismiss(turnoCreado, () => setTurnoCreado(null))

  // Qué botón disparó el submit: se guarda en un ref (no en estado) porque
  // se necesita leer de forma sincrónica apenas handleSubmit resuelve, antes
  // de que un re-render pueda perder el valor.
  const accionGuardadoRef = useRef<'ir-a-lista' | 'agregar-otro'>('ir-a-lista')

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

  // Red de seguridad solo para cuando médicos/consultorios terminan de cargar
  // después de que ya había una especialidad elegida (la elección normal de
  // especialidad ya auto-selecciona el primero en seleccionarEspecialidad).
  // No depende de medicoElegido/consultorioElegido: si dependiera, se
  // reactivaría cada vez que el combobox limpia la selección mientras el
  // usuario está escribiendo para buscar, pisando lo que está tipeando.
  useEffect(() => {
    if (especialidad && !medicoElegido && medicosFiltrados.length > 0) {
      setValue('medico', medicosFiltrados[0].id, { shouldValidate: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicos])

  useEffect(() => {
    if (especialidad && !consultorioElegido && consultoriosFiltrados.length > 0) {
      setValue('consultorio', consultoriosFiltrados[0].id, { shouldValidate: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultorios])

  const seleccionarEspecialidad = (nuevaEspecialidad: string) => {
    const especialidadTipada = nuevaEspecialidad as RecepcionFormValues['especialidad']
    setValue('especialidad', especialidadTipada, { shouldValidate: true })

    const medicosParaEsp = (medicos ?? [])
      .filter((m) => m.especialidades.includes(especialidadTipada))
      .sort((a, b) => a.apellido.localeCompare(b.apellido) || a.nombre.localeCompare(b.nombre))
    setValue('medico', medicosParaEsp[0]?.id ?? '', { shouldValidate: true })

    const consultoriosParaEsp = (consultorios ?? [])
      .filter((c) => c.especialidad === especialidadTipada || !c.especialidad)
      .sort((a, b) => {
        const prioridadA = a.especialidad === especialidadTipada ? 0 : 1
        const prioridadB = b.especialidad === especialidadTipada ? 0 : 1
        return prioridadA - prioridadB || a.numero.localeCompare(b.numero)
      })
    setValue('consultorio', consultoriosParaEsp[0]?.id ?? '', { shouldValidate: true })

    setValue('hora', '')
  }

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

      if (accionGuardadoRef.current === 'agregar-otro') {
        setTurnoCreado(turno)
        reset(valoresIniciales)
      } else {
        navigate('/', { state: { turnoAgendado: true } })
      }
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
            Turno agendado para <strong>{nombreCompleto(turnoCreado.paciente)}</strong> con{' '}
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
            <input type="hidden" {...register('especialidad')} />
            <BuscadorSelect
              id="especialidad"
              opciones={ESPECIALIDADES.map((esp) => ({ valor: esp.valor, etiqueta: esp.etiqueta }))}
              valor={especialidad}
              onSeleccionar={seleccionarEspecialidad}
              placeholder="Escribí o elegí una especialidad..."
              error={errors.especialidad?.message}
              mensajeSinOpciones="No hay especialidades que coincidan."
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="medico">
              Médico
            </label>
            <input type="hidden" {...register('medico')} />
            <BuscadorSelect
              id="medico"
              opciones={medicosFiltrados.map((m) => ({ valor: m.id, etiqueta: `${m.nombre} ${m.apellido}` }))}
              valor={medicoElegido}
              onSeleccionar={(nuevoMedico) => {
                setValue('medico', nuevoMedico, { shouldValidate: true })
                setValue('hora', '')
              }}
              placeholder="Escribí o elegí un médico..."
              placeholderDeshabilitado={especialidad ? undefined : 'Elegí primero una especialidad'}
              deshabilitado={cargandoMedicos || !especialidad}
              error={errors.medico?.message}
              mensajeSinOpciones="No hay médicos que coincidan."
            />
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
              medico={(medicos ?? []).find((m) => m.id === medicoElegido)}
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
            disabled={isSubmitting}
            onClick={() => {
              accionGuardadoRef.current = 'ir-a-lista'
            }}
          >
            {isSubmitting ? 'Guardando...' : 'Registrar recepción'}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            onClick={() => {
              accionGuardadoRef.current = 'agregar-otro'
            }}
          >
            {isSubmitting ? 'Guardando...' : 'Registrar y cargar otra recepción'}
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
