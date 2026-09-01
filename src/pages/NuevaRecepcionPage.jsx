import { useState } from 'react'
import { crearRecepcion } from '../api/recepcionApi'
import { actualizarCampoAnidado } from '../utils/formUtils'
import CamposPaciente from '../components/CamposPaciente'
import { ESPECIALIDADES } from '../constants/turnos'

const estadoInicial = {
  datosPaciente: {
    nombre: '',
    dni: '',
    direccion: { calle: '', numero: '', piso: '', departamento: '', barrio: '' },
    email: '',
    telefono: { tipo: 'CELULAR', codigoArea: '', numero: '' },
    obraSocial: { nombre: '', numeroAfiliado: '' },
  },
  especialidad: '',
  fechaTurno: '',
  observaciones: '',
}

function NuevaRecepcionPage() {
  const [formData, setFormData] = useState(estadoInicial)
  const [errores, setErrores] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [turnoCreado, setTurnoCreado] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => actualizarCampoAnidado(prev, name.split('.'), value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores([])
    setTurnoCreado(null)
    setEnviando(true)

    try {
      const turno = await crearRecepcion({
        ...formData,
        fechaTurno: new Date(formData.fechaTurno).toISOString(),
      })
      setTurnoCreado(turno)
      setFormData(estadoInicial)
    } catch (error) {
      setErrores(error.errores?.length ? error.errores : [error.message])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Recepción</p>
      <h1 className="mb-4">Nueva Recepción</h1>
      <p className="text-body-secondary mb-4">
        Da de alta un paciente y le agenda un turno en un mismo paso.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        {turnoCreado && (
          <div className="alert alert-success" role="alert">
            Turno agendado para <strong>{turnoCreado.paciente.nombre}</strong> (
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

        <CamposPaciente
          valores={formData.datosPaciente}
          prefix="datosPaciente."
          onChange={handleChange}
        />

        <h2 className="h5 mt-4">Turno</h2>
        <div className="row g-3">
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
              required
            >
              <option value="" disabled>
                Seleccioná una opción
              </option>
              {ESPECIALIDADES.map((especialidad) => (
                <option key={especialidad.valor} value={especialidad.valor}>
                  {especialidad.etiqueta}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="fechaTurno">
              Fecha y hora
            </label>
            <input
              id="fechaTurno"
              name="fechaTurno"
              type="datetime-local"
              className="form-control"
              value={formData.fechaTurno}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="observaciones">
              Observaciones
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              className="form-control"
              maxLength={500}
              rows={3}
              value={formData.observaciones}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-4" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Registrar recepción'}
        </button>
      </form>
    </div>
  )
}

export default NuevaRecepcionPage
