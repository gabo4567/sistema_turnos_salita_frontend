import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConsultorioRow from '../components/ConsultorioRow'
import { getConsultorios, darDeBajaConsultorio, type FiltrosConsultorios } from '../api/consultoriosApi'
import { extraerMensaje } from '../api/httpClient'
import { useFetch } from '../hooks/useFetch'
import type { Consultorio } from '../types/Consultorio'

function ConsultoriosPage() {
  const esAdmin = localStorage.getItem('rol') === 'admin'
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState<FiltrosConsultorios['estado']>('activos')
  const { datos, setDatos, cargando, error, setError } = useFetch<Consultorio[]>(
    () => getConsultorios({ estado }),
    [estado]
  )
  const consultorios = datos ?? []

  const consultoriosFiltrados = consultorios.filter((consultorio) =>
    consultorio.numero.toLowerCase().includes(busqueda.toLowerCase())
  )

  const darDeBaja = async (id: string) => {
    try {
      await darDeBajaConsultorio(id)
      setDatos((prev) => (prev ?? []).filter((consultorio) => consultorio.id !== id))
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  return (
    <div className="container text-start py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-label mb-1">Infraestructura</p>
          <h1 className="mb-0">Consultorios</h1>
        </div>
        <Link to="/nuevo-consultorio" className="btn btn-primary">
          Nuevo consultorio
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="d-flex flex-wrap gap-3 mb-3">
        <input
          type="text"
          className="form-control flex-grow-1"
          style={{ minWidth: '200px' }}
          placeholder="Buscar por número..."
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
            <div className="ledger-row consultorio-row placeholder-glow" key={fantasma}>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-4"></span>
              <span className="placeholder col-6"></span>
              <span className="placeholder col-12"></span>
            </div>
          ))}
        </div>
      ) : consultoriosFiltrados.length === 0 ? (
        <p className="text-body-secondary">No se encontraron consultorios.</p>
      ) : (
        <div className="ledger">
          {consultoriosFiltrados.map((consultorio) => (
            <ConsultorioRow
              key={consultorio.id}
              consultorio={consultorio}
              onDarDeBaja={darDeBaja}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ConsultoriosPage
