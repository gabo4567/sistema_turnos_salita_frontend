import { Link } from 'react-router-dom'
import type { Usuario } from '../types/Usuario'
import { useConfirm } from '../hooks/useConfirm'

interface UsuarioRowProps {
  usuario: Usuario
  onDarDeBaja: (id: string) => void
}

const ETIQUETA_ROL: Record<string, string> = {
  admin: 'Administrador',
  recepcionista: 'Recepcionista',
  medico: 'Médico',
}

function UsuarioRow({ usuario, onDarDeBaja }: UsuarioRowProps) {
  const confirmar = useConfirm()

  const handleDarDeBaja = async () => {
    const ok = await confirmar(`¿Dar de baja a ${usuario.nombre}?`, {
      variante: 'peligro',
      textoConfirmar: 'Dar de baja',
    })
    if (ok) onDarDeBaja(usuario.id)
  }

  return (
    <div className="ledger-row paciente-row">
      <span>
        <span className="nombre d-block">{usuario.nombre}</span>
        <span className="dni">{usuario.email}</span>
      </span>
      <span className="obra-social">{ETIQUETA_ROL[usuario.rol] ?? usuario.rol}</span>
      <span className="d-flex gap-2">
        <Link to={`/personal/${usuario.id}/editar`} className="btn btn-outline-primary btn-sm">
          Editar
        </Link>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleDarDeBaja}>
          Dar de baja
        </button>
      </span>
    </div>
  )
}

export default UsuarioRow
