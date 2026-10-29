import { useCallback, useState } from 'react'
import MedicoRow from '../components/MedicoRow'
import MedicoForm from '../components/MedicoForm'
import FormularioModal from '../components/FormularioModal'
import { getMedicos, darDeBajaMedico, type FiltrosMedicos } from '../api/medicosApi'
import { extraerMensaje } from '../api/httpClient'
import { useFetch } from '../hooks/useFetch'
import type { Medico } from '../types/Medico'

function MedicosPage() {
  const esAdmin = localStorage.getItem('rol') === 'admin'
  const [mostrarAlta, setMostrarAlta] = useState(false)
  const cerrarAlta = useCallback(() => setMostrarAlta(false), [])
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState<FiltrosMedicos['estado']>('activos')
  const { datos, setDatos, cargando, error, setError } = useFetch<Medico[]>(
    () => getMedicos({ estado }),
    [estado]
  )
  const medicos = datos ?? []

  const medicosFiltrados = medicos.filter((medico) => {
    const texto = busqueda.toLowerCase()
    return (
      medico.nombre.toLowerCase().includes(texto) ||
      medico.apellido.toLowerCase().includes(texto) ||
      medico.matricula.toLowerCase().includes(texto)
    )
  })

  const darDeBaja = async (id: string) => {
    try {
      await darDeBajaMedico(id)
      setDatos((prev) => (prev ?? []).filter((medico) => medico.id !== id))
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  const agregarMedico = (medico: Medico) => {
    setDatos((prev) => [medico, ...(prev ?? []).filter((actual) => actual.id !== medico.id)])
  }

  return (
    <div className="container text-start py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-label mb-1">Cuerpo médico</p>
          <h1 className="mb-0">Médicos</h1>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setMostrarAlta(true)}>
          Nuevo médico
        </button>
      </div>

      {error && (
        <div className={`alert ${error.startsWith('No se puede dar de baja:') ? 'alert-warning' : 'alert-danger'}`} role="alert">
          {error}
        </div>
      )}

      <div className="d-flex flex-wrap gap-3 mb-3">
        <input
          type="text"
          className="form-control flex-grow-1"
          style={{ minWidth: '200px' }}
          placeholder="Buscar por nombre o matrícula..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          disabled={cargando}
        />
        {esAdmin && (
          <div className="btn-group" role="group" aria-label="Filtrar por estado">
            <button
              type="button"
              className={`btn btn-sm ${estado === 'activos' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setEstado('activos')}
              disabled={cargando}
            >
              Activos
            </button>
            <button
              type="button"
              className={`btn btn-sm ${estado === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setEstado('todos')}
              disabled={cargando}
            >
              Ver inactivos
            </button>
          </div>
        )}
      </div>

      {cargando ? (
        <div className="ledger" aria-hidden="true">
          {[1, 2, 3].map((fantasma) => (
            <div className="ledger-row medico-row placeholder-glow" key={fantasma}>
              <span>
                <span className="placeholder col-6 d-block mb-1"></span>
                <span className="placeholder col-4"></span>
              </span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-12"></span>
            </div>
          ))}
        </div>
      ) : medicosFiltrados.length === 0 ? (
        <p className="text-body-secondary">No se encontraron médicos.</p>
      ) : (
        <div className="ledger">
          {medicosFiltrados.map((medico) => (
            <MedicoRow key={medico.id} medico={medico} onDarDeBaja={darDeBaja} />
          ))}
        </div>
      )}

      {mostrarAlta && (
        <FormularioModal titulo="Nuevo médico" onClose={cerrarAlta}>
          <MedicoForm onCreated={agregarMedico} />
        </FormularioModal>
      )}
    </div>
  )
}

export default MedicosPage
