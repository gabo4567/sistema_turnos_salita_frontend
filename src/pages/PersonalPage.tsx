import { useState } from 'react'
import { Link } from 'react-router-dom'
import UsuarioRow from '../components/UsuarioRow'
import Paginador from '../components/Paginador'
import SelectorOrden from '../components/SelectorOrden'
import { listarUsuariosPaginado, darDeBajaUsuario, type FiltrosUsuarios, type OrdenUsuarios } from '../api/usuariosApi'
import { extraerMensaje } from '../api/httpClient'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'

const ETIQUETA_ROL: Record<string, string> = {
  admin: 'Administrador',
  recepcionista: 'Recepcionista',
  medico: 'Médico',
}

const OPCIONES_ORDEN: { valor: OrdenUsuarios; etiqueta: string }[] = [
  { valor: 'nombre_asc', etiqueta: 'Nombre A-Z' },
  { valor: 'nombre_desc', etiqueta: 'Nombre Z-A' },
  { valor: 'reciente', etiqueta: 'Más recientes' },
  { valor: 'antiguo', etiqueta: 'Más antiguos' },
]

function PersonalPage() {
  const [busqueda, setBusqueda] = useState('')
  const busquedaDebounced = useDebounce(busqueda)
  const [rol, setRol] = useState<FiltrosUsuarios['rol'] | ''>('')
  const [estado, setEstado] = useState<FiltrosUsuarios['estado']>('activos')
  const [orden, setOrden] = useState<OrdenUsuarios>('nombre_asc')
  const [pagina, setPagina] = useState(1)

  const { datos, setDatos, cargando, error, setError } = useFetch(
    () => listarUsuariosPaginado({ rol: rol || undefined, estado, orden, busqueda: busquedaDebounced, pagina }),
    [rol, estado, orden, busquedaDebounced, pagina]
  )
  const usuarios = datos?.items ?? []

  const cambiarFiltro = <T,>(setter: (valor: T) => void) => (valor: T) => {
    setPagina(1)
    setter(valor)
  }

  const darDeBaja = async (id: string) => {
    try {
      await darDeBajaUsuario(id)
      setDatos((prev) => (prev ? { ...prev, items: prev.items.filter((u) => u.id !== id) } : prev))
    } catch (err) {
      setError(extraerMensaje(err))
    }
  }

  return (
    <div className="container text-start py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <p className="section-label mb-1">Administración</p>
          <h1 className="mb-0">Personal</h1>
        </div>
        <Link to="/nuevo-personal" className="btn btn-primary">
          Nuevo usuario
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => cambiarFiltro(setBusqueda)(e.target.value)}
            disabled={cargando}
          />
        </div>
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            value={rol}
            onChange={(e) => cambiarFiltro(setRol)(e.target.value as FiltrosUsuarios['rol'] | '')}
            disabled={cargando}
          >
            <option value="">Todos los roles</option>
            {Object.entries(ETIQUETA_ROL).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-3">
          <SelectorOrden value={orden} onChange={cambiarFiltro(setOrden)} opciones={OPCIONES_ORDEN} disabled={cargando} />
        </div>
        <div className="col-12">
          <div className="btn-group" role="group" aria-label="Filtrar por estado">
            <button
              type="button"
              className={`btn btn-sm ${estado === 'activos' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => cambiarFiltro(setEstado)('activos')}
              disabled={cargando}
            >
              Activos
            </button>
            <button
              type="button"
              className={`btn btn-sm ${estado === 'inactivos' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => cambiarFiltro(setEstado)('inactivos')}
              disabled={cargando}
            >
              Ver inactivos
            </button>
          </div>
        </div>
      </div>

      {cargando ? (
        <p className="text-body-secondary">Cargando...</p>
      ) : usuarios.length === 0 ? (
        <p className="text-body-secondary">No se encontraron usuarios.</p>
      ) : (
        <>
          <div className="ledger">
            {usuarios.map((usuario) => (
              <UsuarioRow key={usuario.id} usuario={usuario} onDarDeBaja={darDeBaja} />
            ))}
          </div>
          {datos && (
            <Paginador
              pagina={datos.pagina}
              totalPaginas={datos.totalPaginas}
              totalRegistros={datos.totalRegistros}
              onCambiarPagina={setPagina}
              disabled={cargando}
            />
          )}
        </>
      )}
    </div>
  )
}

export default PersonalPage
