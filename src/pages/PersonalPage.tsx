import { useState } from 'react'
import { Link } from 'react-router-dom'
import UsuarioRow from '../components/UsuarioRow'
import { getUsuarios, darDeBajaUsuario } from '../api/usuariosApi'
import { extraerMensaje } from '../api/httpClient'
import { useFetch } from '../hooks/useFetch'
import type { Usuario } from '../types/Usuario'

function PersonalPage() {
  const [busqueda, setBusqueda] = useState('')
  const { datos, setDatos, cargando, error, setError } = useFetch<Usuario[]>(getUsuarios)
  const usuarios = datos ?? []

  const filtrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  const darDeBaja = async (id: string) => {
    try {
      await darDeBajaUsuario(id)
      setDatos((prev) => (prev ?? []).filter((u) => u.id !== id))
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

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Buscar por nombre o email..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        disabled={cargando}
      />

      {cargando ? (
        <p className="text-body-secondary">Cargando...</p>
      ) : filtrados.length === 0 ? (
        <p className="text-body-secondary">No se encontraron usuarios.</p>
      ) : (
        <div className="ledger">
          {filtrados.map((usuario) => (
            <UsuarioRow key={usuario.id} usuario={usuario} onDarDeBaja={darDeBaja} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PersonalPage
