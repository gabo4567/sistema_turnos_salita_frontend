import { useState } from 'react'
import { crearPaciente } from '../api/pacientesApi'

const OBRAS_SOCIALES = [
  'PAMI',
  'OSPEL',
  'OSDE',
  'SANCOR',
  'OSECAC',
  'SWISS MEDICAL',
  'GALENO',
  'MEDICUS',
  'OMINT',
  'FEMEBA',
  'OTRAS',
  'NINGUNA',
]

const TIPOS_TELEFONO = ['CELULAR', 'FIJO', 'TRABAJO']

const estadoInicial = {
  nombre: '',
  dni: '',
  direccion: { calle: '', numero: '', piso: '', departamento: '', barrio: '' },
  email: '',
  telefono: { tipo: 'CELULAR', codigoArea: '', numero: '' },
  obraSocial: { nombre: '', numeroAfiliado: '' },
}

function PacienteForm() {
  const [formData, setFormData] = useState(estadoInicial)
  const [errores, setErrores] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [pacienteCreado, setPacienteCreado] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [seccion, campo] = name.split('.')
      setFormData((prev) => ({
        ...prev,
        [seccion]: { ...prev[seccion], [campo]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores([])
    setPacienteCreado(null)
    setEnviando(true)

    try {
      const paciente = await crearPaciente(formData)
      setPacienteCreado(paciente)
      setFormData(estadoInicial)
    } catch (error) {
      setErrores(error.errores?.length ? error.errores : [error.message])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="text-start" noValidate>
      {pacienteCreado && (
        <div className="alert alert-success" role="alert">
          Paciente <strong>{pacienteCreado.nombre}</strong> creado exitosamente
          (DNI {pacienteCreado.dni}).
        </div>
      )}

      {errores.length > 0 && (
        <div className="alert alert-danger" role="alert">
          <p className="fw-semibold mb-1">No se pudo crear el paciente:</p>
          <ul className="mb-0 ps-3">
            {errores.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="h5 mt-4">Datos personales</h2>
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
          <label className="form-label" htmlFor="dni">
            DNI
          </label>
          <input
            id="dni"
            name="dni"
            className="form-control"
            value={formData.dni}
            onChange={handleChange}
            pattern="[0-9]{7,8}"
            title="7 u 8 dígitos"
            required
          />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <h2 className="h5 mt-4">Dirección</h2>
      <div className="row g-3">
        <div className="col-12 col-md-8">
          <label className="form-label" htmlFor="direccion.calle">
            Calle
          </label>
          <input
            id="direccion.calle"
            name="direccion.calle"
            className="form-control"
            value={formData.direccion.calle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-6 col-md-4">
          <label className="form-label" htmlFor="direccion.numero">
            Número
          </label>
          <input
            id="direccion.numero"
            name="direccion.numero"
            className="form-control"
            value={formData.direccion.numero}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label" htmlFor="direccion.piso">
            Piso
          </label>
          <input
            id="direccion.piso"
            name="direccion.piso"
            className="form-control"
            value={formData.direccion.piso}
            onChange={handleChange}
          />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label" htmlFor="direccion.departamento">
            Departamento
          </label>
          <input
            id="direccion.departamento"
            name="direccion.departamento"
            className="form-control"
            value={formData.direccion.departamento}
            onChange={handleChange}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="direccion.barrio">
            Barrio
          </label>
          <input
            id="direccion.barrio"
            name="direccion.barrio"
            className="form-control"
            value={formData.direccion.barrio}
            onChange={handleChange}
          />
        </div>
      </div>

      <h2 className="h5 mt-4">Teléfono</h2>
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="telefono.tipo">
            Tipo
          </label>
          <select
            id="telefono.tipo"
            name="telefono.tipo"
            className="form-select"
            value={formData.telefono.tipo}
            onChange={handleChange}
          >
            {TIPOS_TELEFONO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label" htmlFor="telefono.codigoArea">
            Código de área
          </label>
          <input
            id="telefono.codigoArea"
            name="telefono.codigoArea"
            className="form-control"
            value={formData.telefono.codigoArea}
            onChange={handleChange}
            pattern="[0-9]{2,5}"
            title="2 a 5 dígitos"
            required
          />
        </div>
        <div className="col-6 col-md-5">
          <label className="form-label" htmlFor="telefono.numero">
            Número
          </label>
          <input
            id="telefono.numero"
            name="telefono.numero"
            className="form-control"
            value={formData.telefono.numero}
            onChange={handleChange}
            pattern="[0-9]{7,10}"
            title="7 a 10 dígitos"
            required
          />
        </div>
      </div>

      <h2 className="h5 mt-4">Obra social</h2>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="obraSocial.nombre">
            Obra social
          </label>
          <select
            id="obraSocial.nombre"
            name="obraSocial.nombre"
            className="form-select"
            value={formData.obraSocial.nombre}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Seleccioná una opción
            </option>
            {OBRAS_SOCIALES.map((obraSocial) => (
              <option key={obraSocial} value={obraSocial}>
                {obraSocial}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="obraSocial.numeroAfiliado">
            Número de afiliado
          </label>
          <input
            id="obraSocial.numeroAfiliado"
            name="obraSocial.numeroAfiliado"
            className="form-control"
            value={formData.obraSocial.numeroAfiliado}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-4" disabled={enviando}>
        {enviando ? 'Guardando...' : 'Dar de alta paciente'}
      </button>
    </form>
  )
}

export default PacienteForm
