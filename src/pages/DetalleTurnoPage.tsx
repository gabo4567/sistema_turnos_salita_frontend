import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTurnoPorId } from '../api/turnosApi'
import { getPacientes } from '../api/pacientesApi'
import { analizarHistorial } from '../api/iaApi'
import { extraerMensaje } from '../api/httpClient'
import type { Turno } from '../types/Turno'
import type { AnalisisClinico } from '../types/AnalisisClinico'
import IconoFlechaAtras from '../components/IconoFlechaAtras'

const COLOR_GRAVEDAD: Record<AnalisisClinico['nivelGravedad'], string> = {
  bajo: 'text-bg-success',
  medio: 'text-bg-warning',
  alto: 'text-bg-danger',
}

const ETIQUETAS_ESTADO: Record<string, string> = {
  pendiente: 'En espera',
  llamado: 'Llamado',
  atendido: 'Atendido',
  cancelado: 'Cancelado',
  no_asistio: 'No asistió',
}

function DetalleTurnoPage() {
  const { id } = useParams<{ id: string }>()
  const [turno, setTurno] = useState<Turno | null>(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [analizando, setAnalizando] = useState(false)
  const [errorAnalisis, setErrorAnalisis] = useState<string | null>(null)
  const [analisis, setAnalisis] = useState<AnalisisClinico | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelado = false
    setCargando(true)
    setErrorCarga(null)
    setTurno(null)

    getTurnoPorId(id)
      .then(async (datos) => {
        let datosConHistorial = datos
        if (!Array.isArray(datos.paciente?.historialMedico)) {
          const pacientes = await getPacientes({ dni: datos.paciente.dni })
          if (!pacientes[0]) {
            throw new Error(`No se encontró la historia clínica del paciente ${datos.paciente.dni}.`)
          }
          datosConHistorial = { ...datos, paciente: pacientes[0] }
        }
        if (!cancelado) setTurno(datosConHistorial)
      })
      .catch((error: unknown) => {
        if (!cancelado) setErrorCarga(extraerMensaje(error))
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [id])

  const handleAnalizar = async () => {
    if (!turno || turno.paciente.historialMedico.length === 0) return

    setAnalizando(true)
    setErrorAnalisis(null)
    setAnalisis(null)

    try {
      setAnalisis(await analizarHistorial(turno.paciente.historialMedico))
    } catch (error) {
      setErrorAnalisis(extraerMensaje(error))
    } finally {
      setAnalizando(false)
    }
  }

  return (
    <div className="container text-start py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-label mb-1">Agenda</p>
          <h1 className="mb-0">Detalle del turno</h1>
        </div>
        <Link to="/" className="btn btn-outline-secondary d-inline-flex align-items-center gap-1">
          <IconoFlechaAtras />
          Volver a turnos
        </Link>
      </div>

      {cargando && (
        <div className="card placeholder-glow mb-4" aria-label="Cargando turno">
          <div className="card-body">
            <span className="placeholder col-5 d-block mb-3"></span>
            <span className="placeholder col-8 d-block mb-2"></span>
            <span className="placeholder col-6 d-block mb-2"></span>
            <span className="placeholder col-4 d-block"></span>
          </div>
        </div>
      )}
      {errorCarga && <div className="alert alert-danger" role="alert">{errorCarga}</div>}

      {!cargando && turno && (
        <>
          <section className="card mb-4">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3">
                <h2 className="h5 mb-0">{turno.paciente.nombre}</h2>
                <span className="badge text-bg-primary">
                  {ETIQUETAS_ESTADO[turno.estado ?? 'pendiente'] ?? turno.estado}
                </span>
              </div>
              <dl className="row mb-0">
                <dt className="col-sm-3">DNI</dt>
                <dd className="col-sm-9">{turno.paciente.dni}</dd>
                <dt className="col-sm-3">Fecha y hora</dt>
                <dd className="col-sm-9">
                  {new Date(turno.fechaTurno).toLocaleString('es-AR', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </dd>
                <dt className="col-sm-3">Especialidad</dt>
                <dd className="col-sm-9 text-capitalize">{turno.especialidad}</dd>
                <dt className="col-sm-3">Médico</dt>
                <dd className="col-sm-9">
                  {turno.medico ? `${turno.medico.nombre} ${turno.medico.apellido}` : 'Sin asignar'}
                </dd>
                <dt className="col-sm-3">Consultorio</dt>
                <dd className="col-sm-9">{turno.consultorio?.numero ?? 'Sin asignar'}</dd>
                {turno.observaciones && (
                  <>
                    <dt className="col-sm-3">Observaciones</dt>
                    <dd className="col-sm-9">{turno.observaciones}</dd>
                  </>
                )}
              </dl>
              <div className="d-flex flex-wrap gap-3 mt-2">
                <Link to={`/pacientes/${turno.paciente.dni}/historia`}>Ver historia clínica</Link>
                <Link to={`/turnos/${turno.id}/editar`}>Editar turno</Link>
              </div>
            </div>
          </section>

          <section aria-labelledby="analisis-ia-titulo">
            <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
              <h2 id="analisis-ia-titulo" className="h5 mb-0">Análisis clínico con IA</h2>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAnalizar}
                disabled={analizando || turno.paciente.historialMedico.length === 0}
              >
                {analizando ? 'Analizando...' : 'Analizar con IA'}
              </button>
            </div>

            {turno.paciente.historialMedico.length === 0 && (
              <p className="text-body-secondary">Este paciente todavía no tiene entradas en su historia clínica para analizar.</p>
            )}
            {analizando && (
              <div className="card placeholder-glow" aria-label="Generando análisis clínico" aria-live="polite">
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-2"></span>
                  </div>
                  <span className="placeholder col-10 d-block mb-2"></span>
                  <span className="placeholder col-8 d-block mb-2"></span>
                  <span className="placeholder col-6 d-block"></span>
                  <p className="small text-body-secondary mb-0 mt-3">Puede tardar unos segundos mientras se analiza el historial completo.</p>
                </div>
              </div>
            )}
            {errorAnalisis && <div className="alert alert-danger" role="alert">{errorAnalisis}</div>}
            {analisis && (
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h3 className="h6 mb-0">Resultado del análisis</h3>
                    <span className={`badge ${COLOR_GRAVEDAD[analisis.nivelGravedad]}`}>
                      Gravedad: {analisis.nivelGravedad}
                    </span>
                  </div>
                  <p className="mb-2">{analisis.resumenClinico}</p>
                  {analisis.medicamentosDetectados.length > 0 && (
                    <>
                      <p className="fw-semibold mb-1 small">Medicamentos/tratamientos detectados:</p>
                      <ul className="mb-0 ps-3">
                        {analisis.medicamentosDetectados.map((medicamento, index) => (
                          <li key={index}>{medicamento}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  <p className="small text-body-secondary mt-3 mb-0">
                    Este resultado es orientativo y no reemplaza el criterio profesional.
                  </p>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default DetalleTurnoPage
