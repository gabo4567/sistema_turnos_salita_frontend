import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getMedicos, actualizarMedico } from '../api/medicosApi'
import { ESPECIALIDADES } from '../constants/turnos'

function EditarMedicoPage() {
  const { matricula } = useParams()
  const navigate = useNavigate()

  const [medicoId, setMedicoId] = useState(null)
  const [formData, setFormData] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)
  const [errores, setErrores] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [guardadoOk, setGuardadoOk] = useState(false)

  useEffect(() => {
    let cancelado = false

    getMedicos()
      .then((datos) => {
        if (cancelado) return
        const medico = datos.find((m) => m.matricula === matricula)
        if (!medico) {
          setErrorCarga(`No se encontró ningún médico con matrícula ${matricula}.`)
          return
        }
        setMedicoId(medico.id)
        setFormData({
          nombre: medico.nombre,
          matricula: medico.matricula,
          especialidad: medico.especialidad,
          telefono: medico.telefono || '',
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
  }, [matricula])

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
      await actualizarMedico(medicoId, formData)
      setGuardadoOk(true)
    } catch (error) {
      setErrores(error.errores?.length ? error.errores : [error.message])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Cuerpo médico</p>
      <h1 className="mb-2">Editar Médico</h1>

      {!cargando && !errorCarga && (
        <div className="d-flex gap-3 mb-4">
          <Link to="/medicos">Volver a Médicos</Link>
        </div>
      )}

      {cargando && <p className="text-body-secondary">Cargando datos del médico...</p>}

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          {errorCarga}{' '}
          <button
            type="button"
            className="btn btn-link p-0 align-baseline"
            onClick={() => navigate('/medicos')}
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
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="nombre">
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="matricula">
                Matrícula
              </label>
              <input
                id="matricula"
                name="matricula"
                className="form-control"
                value={formData.matricula}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="especialidad">
                Especialidad
              </label>
              <select
                id="especialidad"
                name="especialidad"
                className="form-select"
                value={formData.especialidad}
                onChange={handleChange}
                required
              >
                {ESPECIALIDADES.map((esp) => (
                  <option key={esp.valor} value={esp.valor}>
                    {esp.etiqueta}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="telefono">
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                className="form-control"
                value={formData.telefono}
                onChange={handleChange}
              />
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

export default EditarMedicoPage
