import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface FormularioModalProps {
  titulo: string
  onClose: () => void
  children: ReactNode
}

function FormularioModal({ titulo, onClose, children }: FormularioModalProps) {
  useEffect(() => {
    const body = document.body
    body.classList.add('modal-open')

    const manejarTecla = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', manejarTecla)

    return () => {
      body.classList.remove('modal-open')
      document.removeEventListener('keydown', manejarTecla)
    }
  }, [onClose])

  return (
    <>
      <div className="modal-backdrop fade show" aria-hidden="true" />
      <div
        className="modal d-block"
        role="dialog"
        aria-modal="true"
        aria-labelledby="formulario-modal-titulo"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5" id="formulario-modal-titulo">{titulo}</h2>
              <button type="button" className="btn-close" aria-label="Volver" onClick={onClose} />
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FormularioModal
