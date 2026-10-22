import { useEffect, useState } from 'react'
import { getMiPerfil, type Perfil } from '../api/authApi'
import { extraerMensaje } from '../api/httpClient'

interface PerfilModalProps {
  onCerrar: () => void
}

const ETIQUETA_ROL: Record<string, string> = {
  admin: 'Administrador',
  recepcionista: 'Recepcionista',
  paciente: 'Paciente',
  medico: 'Médico',
}

function camposDelPerfil(perfil: Perfil): Array<[string, string]> {
  if (perfil.rol === 'paciente') {
    const direccion = `${perfil.direccion.calle} ${perfil.direccion.numero}${perfil.direccion.piso ? `, piso ${perfil.direccion.piso}` : ''}`

    return [
      ['DNI', perfil.dni],
      ['Email', perfil.email],
      ['Teléfono', `${perfil.telefono.codigoArea} ${perfil.telefono.numero}`],
      ['Dirección', direccion],
      ['Obra social', perfil.obraSocial.nombre],
    ]
  }

  return [['Email', perfil.email]]
}

function PerfilModal({ onCerrar }: PerfilModalProps) {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelado = false

    getMiPerfil()
      .then((datos) => {
        if (!cancelado) setPerfil(datos)
      })
      .catch((err) => {
        if (!cancelado) setError(extraerMensaje(err))
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCerrar])

  return (
    <div className="confirm-backdrop" onClick={onCerrar}>
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="perfil-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="confirm-titulo" id="perfil-titulo">
          Mi cuenta
        </h2>

        {cargando && <p className="text-body-secondary mb-0">Cargando...</p>}
        {error && (
          <p className="text-danger mb-0" role="alert">
            {error}
          </p>
        )}

        {perfil && (
          <dl className="mb-0">
            <div className="mb-2">
              <dt className="section-label mb-1">Nombre</dt>
              <dd className="mb-0">{perfil.nombre}</dd>
            </div>
            <div className="mb-2">
              <dt className="section-label mb-1">Rol</dt>
              <dd className="mb-0">{ETIQUETA_ROL[perfil.rol] ?? perfil.rol}</dd>
            </div>
            {camposDelPerfil(perfil).map(([etiqueta, valor]) => (
              <div className="mb-2" key={etiqueta}>
                <dt className="section-label mb-1">{etiqueta}</dt>
                <dd className="mb-0">{valor}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="confirm-acciones mt-3">
          <button type="button" className="btn btn-primary" onClick={onCerrar} autoFocus>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default PerfilModal
