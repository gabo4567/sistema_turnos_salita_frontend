import { useEffect, useState } from 'react'
import { getPacientes } from '../api/pacientesApi'
import { getMedicos } from '../api/medicosApi'
import { getConsultorios } from '../api/consultoriosApi'
import { crearTurno } from '../api/turnosApi'
import { ESPECIALIDADES } from '../constants/turnos'
import { useFetch } from '../hooks/useFetch'

function NuevoTurnoPage() {
  const [pacientes, setPacientes] = useState([])
  const [cargandoPacientes, setCargandoPacientes] = useState(true)
  const [errorCarga, setErrorCarga] = useState(null)

  const { datos: medicos, cargando: cargandoMedicos } = useFetch(getMedicos)
  const { datos: consultorios, cargando: cargandoConsultorios } = useFetch(getConsultorios)

  const [busqueda, setBusqueda] = useState('')
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)
  const [especialidad, setEspecialidad] = useState('')
  const [medico, setMedico] = useState('')
  const [consultorio, setConsultorio] = useState('')
  const [fechaTurno, setFechaTurno] = useState('')
  const [observaciones, setObservaciones] = useState('')

  const [errores, setErrores] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [turnoCreado, setTurnoCreado] = useState(null)

  useEffect(() => {
    getPacientes()
      .then(setPacientes)
      .catch((err) => setErrorCarga(err.message))
      .finally(() => setCargandoPacientes(false))
  }, [])

  const medicosFiltrados = (medicos ?? []).filter(
    (m) => !especialidad || m.especialidad === especialidad
  )

  const handleEspecialidadChange = (e) => {
    setEspecialidad(e.target.value)
    setMedico('')
  }

  const coincidencias =
    busqueda.trim() === ''
      ? []
      : pacientes
          .filter(
            (p) =>
              p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.dni.includes(busqueda)
          )
          .slice(0, 8)

  const seleccionarPaciente = (paciente) => {
    setPacienteSeleccionado(paciente)
    setBusqueda('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrores([])
    setTurnoCreado(null)
    setEnviando(true)

    try {
      const payload = {
        paciente: pacienteSeleccionado.id,
        especialidad,
        medico,
        fechaTurno: new Date(fechaTurno).toISOString(),
        observaciones,
      }
      if (consultorio) payload.consultorio = consultorio

      await crearTurno(payload)
      setTurnoCreado({
        paciente: pacienteSeleccionado,
        especialidad,
        fechaTurno,
        medico: medicos.find((m) => m.id === medico),
        consultorio: consultorios?.find((c) => c.id === consultorio),
      })
      setPacienteSeleccionado(null)
      setEspecialidad('')
      setMedico('')
      setConsultorio('')
      setFechaTurno('')
      setObservaciones('')
    } catch (error) {
      setErrores(error.errores?.length ? error.errores : [error.message])
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container text-start py-4">
      <p className="section-label mb-1">Agenda</p>
      <h1 className="mb-4">Nuevo Turno</h1>
      <p className="text-body-secondary mb-4">
        Agendá un turno para un paciente que ya está en el padrón.
      </p>

      {errorCarga && (
        <div className="alert alert-danger" role="alert">
          {errorCarga}
        </div>
      )}

      {turnoCreado && (
        <div className="alert alert-success" role="alert">
          Turno agendado para <strong>{turnoCreado.paciente.nombre}</strong> con{' '}
          {turnoCreado.medico?.nombre ?? 'el médico asignado'}
          {turnoCreado.consultorio && ` en el consultorio ${turnoCreado.consultorio.numero}`} (
          {ESPECIALIDADES.find((e) => e.valor === turnoCreado.especialidad)?.etiqueta} —{' '}
          {new Date(turnoCreado.fechaTurno).toLocaleString('es-AR')}).
        </div>
      )}

      {errores.length > 0 && (
        <div className="alert alert-danger" role="alert">
          <p className="fw-semibold mb-1">No se pudo agendar el turno:</p>
          <ul className="mb-0 ps-3">
            {errores.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <h2 className="h5 mt-2">Paciente</h2>

        {pacienteSeleccionado ? (
          <div className="d-flex align-items-center justify-content-between border rounded p-3 mb-3">
            <span>
              <strong>{pacienteSeleccionado.nombre}</strong> — DNI {pacienteSeleccionado.dni}
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm"
              onClick={() => setPacienteSeleccionado(null)}
            >
              Cambiar
            </button>
          </div>
        ) : (
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar paciente por nombre o DNI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              disabled={cargandoPacientes}
            />
            {coincidencias.length > 0 && (
              <div className="border rounded mt-2">
                {coincidencias.map((paciente) => (
                  <button
                    type="button"
                    key={paciente.id}
                    className="d-block w-100 text-start btn btn-light border-0 rounded-0"
                    onClick={() => seleccionarPaciente(paciente)}
                  >
                    {paciente.nombre} — DNI {paciente.dni}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <h2 className="h5 mt-4">Turno</h2>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="especialidad">
              Especialidad
            </label>
            <select
              id="especialidad"
              className="form-select"
              value={especialidad}
              onChange={handleEspecialidadChange}
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
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="medico">
              Médico
            </label>
            <select
              id="medico"
              className="form-select"
              value={medico}
              onChange={(e) => setMedico(e.target.value)}
              disabled={cargandoMedicos || !especialidad}
              required
            >
              <option value="" disabled>
                {especialidad ? 'Seleccioná una opción' : 'Elegí primero una especialidad'}
              </option>
              {medicosFiltrados.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
            {especialidad && medicosFiltrados.length === 0 && (
              <div className="form-text text-danger">
                No hay médicos cargados para esta especialidad.
              </div>
            )}
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label" htmlFor="consultorio">
              Consultorio
            </label>
            <select
              id="consultorio"
              className="form-select"
              value={consultorio}
              onChange={(e) => setConsultorio(e.target.value)}
              disabled={cargandoConsultorios}
            >
              <option value="">Sin asignar</option>
              {(consultorios ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  Consultorio {c.numero}
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
              type="datetime-local"
              className="form-control"
              value={fechaTurno}
              onChange={(e) => setFechaTurno(e.target.value)}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="observaciones">
              Observaciones
            </label>
            <textarea
              id="observaciones"
              className="form-control"
              maxLength={500}
              rows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={enviando || !pacienteSeleccionado}
        >
          {enviando ? 'Guardando...' : 'Agendar turno'}
        </button>
      </form>
    </div>
  )
}

export default NuevoTurnoPage
