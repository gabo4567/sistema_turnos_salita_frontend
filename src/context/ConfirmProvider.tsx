import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ConfirmContext, type ConfirmarFn, type OpcionesConfirmacion } from './ConfirmContext'

interface EstadoConfirmacion extends OpcionesConfirmacion {
  mensaje: string
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoConfirmacion | null>(null)
  const resolverRef = useRef<((valor: boolean) => void) | null>(null)

  const confirmar = useCallback<ConfirmarFn>((mensaje, opciones) => {
    setEstado({ mensaje, ...opciones })
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const cerrar = useCallback((valor: boolean) => {
    resolverRef.current?.(valor)
    resolverRef.current = null
    setEstado(null)
  }, [])

  useEffect(() => {
    if (!estado) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [estado, cerrar])

  return (
    <ConfirmContext.Provider value={confirmar}>
      {children}
      {estado && (
        <div className="confirm-backdrop" onClick={() => cerrar(false)}>
          <div
            className="confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-mensaje"
            onClick={(e) => e.stopPropagation()}
          >
            {estado.titulo && <h2 className="confirm-titulo">{estado.titulo}</h2>}
            <p id="confirm-mensaje" className="confirm-mensaje">
              {estado.mensaje}
            </p>
            <div className="confirm-acciones">
              <button type="button" className="btn btn-link" onClick={() => cerrar(false)}>
                {estado.textoCancelar ?? 'Cancelar'}
              </button>
              <button
                type="button"
                className={`btn ${estado.variante === 'peligro' ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => cerrar(true)}
                autoFocus
              >
                {estado.textoConfirmar ?? 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}
