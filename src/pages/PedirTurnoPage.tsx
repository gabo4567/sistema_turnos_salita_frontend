import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getMedicos } from '../api/medicosApi'
import { crearTurno } from '../api/turnosApi'
import { extraerMensajesError } from '../api/httpClient'
import { ESPECIALIDADES } from '../constants/turnos'
import { IconoEspecialidad } from '../constants/especialidadIconos'
import { useFetch } from '../hooks/useFetch'
import { PedirTurnoSchema, type PedirTurnoFormValues } from '../schemas/turno.schema'
import { obtenerFechaMinima } from '../utils/fecha'
import SelectorHorario from '../components/SelectorHorario'
import BuscadorSelect from '../components/BuscadorSelect'
import type { Medico } from '../types/Medico'

const valoresIniciales: PedirTurnoFormValues = {
  especialidad: '' as PedirTurnoFormValues['especialidad'],
  medico: '',
  fecha: '',
  hora: '',
  observaciones: '',
}

function PedirTurnoPage() {
  const navigate = useNavigate()
  const { datos: medicos, cargando: cargandoMedicos } = useFetch<Medico[]>(getMedicos)

  const [errores, setErrores] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PedirTurnoFormValues>({
    resolver: zodResolver(PedirTurnoSchema),
    defaultValues: valoresIniciales,
  })

  const especialidad = watch('especialidad')
  const medicoElegido = watch('medico')
  const fechaElegida = watch('fecha')
  const horaElegida = watch('hora')

  // Ordenados alfabéticamente por apellido: al elegir especialidad, siempre
  // se auto-selecciona el primero de la lista (no solo cuando hay uno solo).
  const medicosFiltrados = (medicos ?? [])
    .filter((m) => !especialidad || m.especialidades.includes(especialidad))
    .sort((a, b) => a.apellido.localeCompare(b.apellido) || a.nombre.localeCompare(b.nombre))

  // Red de seguridad solo para cuando médicos termina de cargar después de
  // que ya había una especialidad elegida (elegir una tarjeta de especialidad
  // ya auto-selecciona el primero más abajo). No depende de medicoElegido: si
  // dependiera, se reactivaría cada vez que el combobox limpia la selección
  // mientras el usuario está escribiendo para buscar, pisando lo que tipea.
  useEffect(() => {
    if (especialidad && !medicoElegido && medicosFiltrados.length > 0) {
      setValue('medico', medicosFiltrados[0].id, { shouldValidate: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicos])

  const seleccionarEspecialidad = (nuevaEspecialidad: PedirTurnoFormValues['especialidad']) => {
    setValue('especialidad', nuevaEspecialidad, { shouldValidate: true })

    const medicosParaEsp = (medicos ?? [])
      .filter((m) => m.especialidades.includes(nuevaEspecialidad))
      .sort((a, b) => a.apellido.localeCompare(b.apellido) || a.nombre.localeCompare(b.nombre))
    setValue('medico', medicosParaEsp[0]?.id ?? '', { shouldValidate: true })

    setValue('hora', '')
  }

  const onSubmit = async (datos: PedirTurnoFormValues) => {
    setErrores([])

    try {
      const { fecha, hora, ...resto } = datos
      const fechaTurno = new Date(`${fecha}T${hora}:00`).toISOString()

      // El backend ignora este valor y usa el paciente logueado; se manda
      // un id cualquiera no vacío solo para que pase la validación del body.
      await crearTurno({
        ...resto,
        paciente: 'paciente-logueado',
        fechaTurno,
      })
      // Se va a Mis Turnos en vez de quedarse acá: el paciente pide un solo
      // turno por vez, y ver el turno ya en su lista confirma mejor que se
      // guardó que un cartel que puede desaparecer si navega o refresca.
      navigate('/mis-turnos', { state: { turnoAgendado: true } })
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Mi cuenta</p>
      <h1 className="mb-4">Pedir Turno</h1>

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
            <div className="col-12">
            <label className="form-label d-block">Especialidad</label>
            <input type="hidden" {...register('especialidad')} />
            <div className="especialidad-grid">
              {ESPECIALIDADES.map((esp) => (
                <button
                  key={esp.valor}
                  type="button"
                  className={`especialidad-card${especialidad === esp.valor ? ' activa' : ''}`}
                  onClick={() => seleccionarEspecialidad(esp.valor)}
                >
                  <span className="especialidad-icono" aria-hidden="true">
                    <IconoEspecialidad especialidad={esp.valor} />
                  </span>
                  <span>{esp.etiqueta}</span>
                </button>
              ))}
            </div>
            {errors.especialidad && <div className="text-danger small mt-2">{errors.especialidad.message}</div>}
          </div>
          <div className="col-12 col-md-6">
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
          <div className="col-12 col-md-6">
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
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Pedir turno'}
          </button>
          <button type="button" className="btn btn-outline-danger" onClick={() => navigate(-1)}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default PedirTurnoPage
