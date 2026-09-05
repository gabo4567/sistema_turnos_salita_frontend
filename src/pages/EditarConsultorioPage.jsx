import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getConsultorios, actualizarConsultorio } from '../api/consultoriosApi'
import { ESPECIALIDADES } from '../constants/turnos'

function EditarConsultorioPage() {
  const { numero } = useParams()
  const navigate = useNavigate()

  const [consultorioId, setConsultorioId] = useState(null)
  const [formData, setFormData] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)
  const [errores, setErrores] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [guardadoOk, setGuardadoOk] = useState(false)

  useEffect(() => {
    let cancelado = false

    getConsultorios()
      .then((datos) => {
        if (cancelado) return
        const consultorio = datos.find((c) => c.numero === numero)
        if (!consultorio) {
          setErrorCarga(`No se encontró ningún consultorio con número ${numero}.`)
          return
        }
        setConsultorioId(consultorio.id)
        setFormData({
          numero: consultorio.numero,
          piso: consultorio.piso || '',
          especialidad: consultorio.especialidad || '',
        })
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
  }, [numero])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores([])
    setGuardadoOk(false)
    setEnviando(true)

    try {
      await actualizarConsultorio(consultorioId, formData)
      setGuardadoOk(true)
    } catch (error) {
      setErrores(error.errores?.length ? error.errores : [error.message])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Infraestructura</p>
      <h1 className="mb-2">Editar Consultorio</h1>

      {!cargando && !errorCarga && (
        <div className="d-flex gap-3 mb-4">
          <Link to="/consultorios">Volver a Consultorios</Link>
        </div>
      )}

      {cargando && <p className="text-body-secondary">Cargando datos del consultorio...</p>}

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          {errorCarga}{' '}
          <button
            type="button"
            className="btn btn-link p-0 align-baseline"
            onClick={() => navigate('/consultorios')}
          >
            Volver al listado
          </button>
        </div>
      )}

      {!cargando && formData && (
        <form onSubmit={handleSubmit} noValidate>
          {guardadoOk && (
            <div className="alert alert-success" role="alert">
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

          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="numero">
                Número
              </label>
              <input
                id="numero"
                name="numero"
                className="form-control"
                value={formData.numero}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="piso">
                Piso
              </label>
              <input
                id="piso"
                name="piso"
                className="form-control"
                value={formData.piso}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label" htmlFor="especialidad">
                Especialidad
              </label>
              <select
                id="especialidad"
                name="especialidad"
                className="form-select"
                value={formData.especialidad}
                onChange={handleChange}
              >
                <option value="">General</option>
                {ESPECIALIDADES.map((esp) => (
                  <option key={esp.valor} value={esp.valor}>
                    {esp.etiqueta}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={enviando}>
            {enviando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      )}
    </div>
  )
}

export default EditarConsultorioPage
