interface PaginadorProps {
  pagina: number
  totalPaginas: number
  totalRegistros: number
  onCambiarPagina: (pagina: number) => void
  disabled?: boolean
}

function Paginador({ pagina, totalPaginas, totalRegistros, onCambiarPagina, disabled }: PaginadorProps) {
  if (totalRegistros === 0) return null

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
      <span className="text-body-secondary small">
        {totalRegistros} {totalRegistros === 1 ? 'resultado' : 'resultados'} — página {pagina} de {totalPaginas}
      </span>
      <div className="btn-group" role="group" aria-label="Paginación">
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => onCambiarPagina(pagina - 1)}
          disabled={disabled || pagina <= 1}
        >
          Anterior
        </button>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => onCambiarPagina(pagina + 1)}
          disabled={disabled || pagina >= totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default Paginador
