import { useState } from 'react'
import { crearConsultorio } from '../api/consultoriosApi'
import { ESPECIALIDADES } from '../constants/turnos'

const estadoInicial = { numero: '', piso: '', especialidad: '' }

function NuevoConsultorioPage() {
  const [formData, setFormData] = useState(estadoInicial)
  const [errores, setErrores] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [consultorioCreado, setConsultorioCreado] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores([])
    setConsultorioCreado(null)
    setEnviando(true)

    try {
      const consultorio = await crearConsultorio(formData)
      setConsultorioCreado(consultorio)
      setFormData(estadoInicial)
    } catch (error) {
      setErrores(error.errores?.length ? error.errores : [error.message])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Infraestructura</p>
      <h1 className="mb-4">Nuevo Consultorio</h1>

      <form onSubmit={handleSubmit} noValidate>
        {consultorioCreado && (
          <div className="alert alert-success" role="alert">
            Consultorio <strong>{consultorioCreado.numero}</strong> agregado exitosamente.
          </div>
        )}

        {errores.length > 0 && (
          <div className="alert alert-danger" role="alert">
            <p className="fw-semibold mb-1">No se pudo crear el consultorio:</p>
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
          {enviando ? 'Guardando...' : 'Agregar consultorio'}
        </button>
      </form>
    </div>
  )
}

export default NuevoConsultorioPage
