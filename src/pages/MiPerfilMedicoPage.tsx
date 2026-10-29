import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { actualizarMedico, getMiMedico } from '../api/medicosApi'
import { extraerMensaje, extraerMensajesError } from '../api/httpClient'
import { useAutoDismiss } from '../hooks/useAutoDismiss'
import { ActualizarTelefonoMedicoSchema, type ActualizarTelefonoMedicoFormValues } from '../schemas/medico.schema'
import type { Medico } from '../types/Medico'

function MiPerfilMedicoPage() {
  const [medico, setMedico] = useState<Medico | null>(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [errores, setErrores] = useState<string[]>([])
  const [guardadoOk, setGuardadoOk] = useState(false)
  useAutoDismiss(guardadoOk, () => setGuardadoOk(false))

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActualizarTelefonoMedicoFormValues>({
    resolver: zodResolver(ActualizarTelefonoMedicoSchema),
    defaultValues: { telefono: '' },
  })

  useEffect(() => {
    let cancelado = false

    getMiMedico()
      .then((datos) => {
        if (cancelado) return
        setMedico(datos)
        reset({ telefono: datos.telefono ?? '' })
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
  }, [reset])

  const onSubmit = async (datos: ActualizarTelefonoMedicoFormValues) => {
    if (!medico) return
    setErrores([])
    setGuardadoOk(false)

    try {
      const medicoActualizado = await actualizarMedico(medico.id, { telefono: datos.telefono })
      setMedico(medicoActualizado)
      reset({ telefono: medicoActualizado.telefono ?? '' })
      setGuardadoOk(true)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Tu cuenta</p>
      <h1 className="mb-2">Mi perfil</h1>
      <p className="text-body-secondary mb-4">
        Solo podés modificar tu teléfono. Para cambiar tu nombre o matrícula, pedíselo a un administrador.
      </p>

      {cargando && <p className="text-body-secondary">Cargando datos del perfil...</p>}

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          {errorCarga}
        </div>
      )}

      {!cargando && !errorCarga && medico && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {guardadoOk && (
            <div className="alert alert-success" role="status">
              Teléfono actualizado correctamente.
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

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="nombre">
                Nombre y apellido <span className="text-body-secondary">(no editable)</span>
              </label>
              <input
                id="nombre"
                className="form-control"
                value={`${medico.nombre} ${medico.apellido}`}
                disabled
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="matricula">
                Matrícula <span className="text-body-secondary">(no editable)</span>
              </label>
              <input id="matricula" className="form-control" value={medico.matricula} disabled />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="telefono">
                Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                autoComplete="tel"
                className={`form-control${errors.telefono ? ' is-invalid' : ''}`}
                {...register('telefono')}
              />
              {errors.telefono && <div className="invalid-feedback">{errors.telefono.message}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      )}
    </div>
  )
}

export default MiPerfilMedicoPage
