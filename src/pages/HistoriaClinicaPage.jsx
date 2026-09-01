import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPacientes, actualizarPaciente } from '../api/pacientesApi'

const entradaVacia = { fecha: '', diagnostico: '', tratamiento: '', medico: '' }

function HistoriaClinicaPage() {
  const { dni } = useParams()

  const [paciente, setPaciente] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)

  const [formData, setFormData] = useState(entradaVacia)
  const [errores, setErrores] = useState([])
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    let cancelado = false

    getPacientes({ dni })
      .then((datos) => {
        if (cancelado) return
        if (!datos[0]) {
          setErrorCarga(`No se encontró ningún paciente con DNI ${dni}.`)
          return
        }
        setPaciente(datos[0])
      })
      .catch((err) => {
        if (!cancelado) setErrorCarga(err.message)
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [dni])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores([])
    setEnviando(true)

    try {
      const nuevaEntrada = { ...formData, fecha: new Date(formData.fecha).toISOString() }
      const actualizado = await actualizarPaciente(paciente.id, {
        historialMedico: [...paciente.historialMedico, nuevaEntrada],
      })
      setPaciente(actualizado)
      setFormData(entradaVacia)
    } catch (error) {
      setErrores(error.errores?.length ? error.errores : [error.message])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Padrón</p>
      <h1 className="mb-2">Historia Clínica</h1>

      {paciente && (
        <div className="d-flex gap-3 mb-4">
          <Link to={`/pacientes/${dni}/editar`}>Editar datos</Link>
          <Link to="/pacientes">Volver a Pacientes</Link>
        </div>
      )}

      {cargando && <p className="text-body-secondary">Cargando datos del paciente...</p>}

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          {errorCarga}
        </div>
      )}

      {!cargando && paciente && (
        <>
          <p className="mb-4">
            <strong>{paciente.nombre}</strong> — DNI {paciente.dni} —{' '}
            {paciente.obraSocial?.nombre || 'Particular'}
          </p>

          <h2 className="h5">Entradas registradas</h2>
          {paciente.historialMedico.length === 0 ? (
            <p className="text-body-secondary mb-4">Todavía no tiene entradas en su historial.</p>
          ) : (
            <div className="ledger mb-4">
              {[...paciente.historialMedico]
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                .map((entrada, index) => (
                  <div className="ledger-row historial-row" key={entrada._id ?? index}>
                    <span className="fecha">
                      {new Date(entrada.fecha).toLocaleDateString('es-AR')}
                    </span>
                    <span>
                      <span className="diagnostico d-block">{entrada.diagnostico}</span>
                      <span className="tratamiento">{entrada.tratamiento}</span>
                    </span>
                    <span className="medico">{entrada.medico}</span>
                  </div>
                ))}
            </div>
          )}

          <h2 className="h5 mt-4">Agregar entrada</h2>

          {errores.length > 0 && (
            <div className="alert alert-danger" role="alert">
              <p className="fw-semibold mb-1">No se pudo guardar la entrada:</p>
              <ul className="mb-0 ps-3">
                {errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="fecha">
                  Fecha
                </label>
                <input
                  id="fecha"
                  name="fecha"
                  type="datetime-local"
                  className="form-control"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="medico">
                  Médico a cargo
                </label>
                <input
                  id="medico"
                  name="medico"
                  className="form-control"
                  value={formData.medico}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="diagnostico">
                  Diagnóstico
                </label>
                <input
                  id="diagnostico"
                  name="diagnostico"
                  className="form-control"
                  value={formData.diagnostico}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="tratamiento">
                  Tratamiento
                </label>
                <input
                  id="tratamiento"
                  name="tratamiento"
                  className="form-control"
                  value={formData.tratamiento}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-4" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Agregar al historial'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default HistoriaClinicaPage
