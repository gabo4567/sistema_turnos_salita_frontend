import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearUsuario } from '../api/usuariosApi'
import { crearMedico } from '../api/medicosApi'
import { extraerMensajesError } from '../api/httpClient'
import { ESPECIALIDADES } from '../constants/turnos'
import { NuevoPersonalSchema, type NuevoPersonalFormValues } from '../schemas/personal.schema'

const valoresIniciales: NuevoPersonalFormValues = {
  nombre: '',
  email: '',
  password: '',
  rol: '',
  apellido: '',
  matricula: '',
  especialidades: [],
  telefono: '',
  cupoMaximo: 15,
}

function NuevoPersonalPage() {
  const [errores, setErrores] = useState<string[]>([])
  const [mensajeExito, setMensajeExito] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NuevoPersonalFormValues>({
    resolver: zodResolver(NuevoPersonalSchema),
    defaultValues: valoresIniciales,
  })

  const rol = watch('rol')

  const onSubmit = async (datos: NuevoPersonalFormValues) => {
    setErrores([])
    setMensajeExito(null)

    try {
      if (datos.rol === 'medico') {
        const medico = await crearMedico({
          nombre: datos.nombre,
          apellido: datos.apellido,
          especialidades: datos.especialidades,
          matricula: datos.matricula,
          telefono: datos.telefono,
          cupoMaximo: datos.cupoMaximo,
          email: datos.email,
          password: datos.password,
        })
        setMensajeExito(`Médico ${medico.nombre} ${medico.apellido} creado exitosamente.`)
      } else if (datos.rol === 'admin' || datos.rol === 'recepcionista') {
        const usuario = await crearUsuario({
          nombre: datos.nombre,
          email: datos.email,
          password: datos.password,
          rol: datos.rol,
        })
        setMensajeExito(`Usuario ${usuario.nombre} agregado exitosamente.`)
      } else {
        setErrores(['Seleccioná un rol válido.'])
        return
      }
      reset(valoresIniciales)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Administración</p>
      <h1 className="mb-4">Nuevo Personal</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {mensajeExito && (
          <div className="alert alert-success" role="status">
            {mensajeExito}
          </div>
        )}

        {errores.length > 0 && (
          <div className="alert alert-danger" role="alert">
            <p className="fw-semibold mb-1">No se pudo crear el usuario:</p>
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
              {rol === 'medico' ? 'Nombre' : 'Nombre completo'}
            </label>
            <input
              id="nombre"
              className={`form-control${errors.nombre ? ' is-invalid' : ''}`}
              {...register('nombre')}
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>}
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
            <label className="form-label" htmlFor="rol">
              Rol
            </label>
            <select id="rol" className={`form-select${errors.rol ? ' is-invalid' : ''}`} {...register('rol')}>
              <option value="" disabled>
                Seleccioná una opción
              </option>
              <option value="admin">Administrador</option>
              <option value="recepcionista">Recepcionista</option>
              <option value="medico">Médico</option>
            </select>
            {errors.rol && <div className="invalid-feedback">{errors.rol.message}</div>}
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

        {rol === 'medico' && (
          <>
            <h2 className="h5 mt-4">Datos del médico</h2>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="apellido">Apellido</label>
                <input id="apellido" className={`form-control${errors.apellido ? ' is-invalid' : ''}`} {...register('apellido')} />
                {errors.apellido && <div className="invalid-feedback">{errors.apellido.message}</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="matricula">Matrícula</label>
                <input id="matricula" className={`form-control${errors.matricula ? ' is-invalid' : ''}`} {...register('matricula')} />
                {errors.matricula && <div className="invalid-feedback">{errors.matricula.message}</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="telefono">Teléfono</label>
                <input id="telefono" className="form-control" {...register('telefono')} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="cupoMaximo">Cupo máximo de turnos por día</label>
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
                <label className="form-label d-block">Especialidades</label>
                <div className="d-flex flex-wrap gap-3">
                  {ESPECIALIDADES.map((especialidad) => (
                    <div className="form-check" key={especialidad.valor}>
                      <input
                        type="checkbox"
                        id={`especialidad-${especialidad.valor}`}
                        className="form-check-input"
                        value={especialidad.valor}
                        {...register('especialidades')}
                      />
                      <label className="form-check-label" htmlFor={`especialidad-${especialidad.valor}`}>
                        {especialidad.etiqueta}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.especialidades && (
                  <div className="text-danger small mt-1">{errors.especialidades.message}</div>
                )}
              </div>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : rol === 'medico' ? 'Crear médico' : 'Crear usuario'}
        </button>
      </form>
    </div>
  )
}

export default NuevoPersonalPage
