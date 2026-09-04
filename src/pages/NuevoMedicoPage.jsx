import { useState } from 'react'
import { crearMedico } from '../api/medicosApi'
import { ESPECIALIDADES } from '../constants/turnos'

const estadoInicial = { nombre: '', especialidad: '', matricula: '', telefono: '' }

function NuevoMedicoPage() {
  const [formData, setFormData] = useState(estadoInicial)
  const [errores, setErrores] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [medicoCreado, setMedicoCreado] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores([])
    setMedicoCreado(null)
    setEnviando(true)

    try {
      const medico = await crearMedico(formData)
      setMedicoCreado(medico)
      setFormData(estadoInicial)
    } catch (error) {
      setErrores(error.errores?.length ? error.errores : [error.message])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Cuerpo médico</p>
      <h1 className="mb-4">Nuevo Médico</h1>

      <form onSubmit={handleSubmit} noValidate>
        {medicoCreado && (
          <div className="alert alert-success" role="alert">
            Médico <strong>{medicoCreado.nombre}</strong> agregado exitosamente.
          </div>
        )}

        {errores.length > 0 && (
          <div className="alert alert-danger" role="alert">
            <p className="fw-semibold mb-1">No se pudo crear el médico:</p>
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
              <option value="" disabled>
                Seleccioná una opción
              </option>
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
          {enviando ? 'Guardando...' : 'Agregar médico'}
        </button>
      </form>
    </div>
  )
}

export default NuevoMedicoPage
