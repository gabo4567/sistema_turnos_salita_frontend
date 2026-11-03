interface OpcionOrden<T extends string> {
  valor: T
  etiqueta: string
}

interface SelectorOrdenProps<T extends string> {
  value: T
  onChange: (valor: T) => void
  opciones: OpcionOrden<T>[]
  disabled?: boolean
}

function SelectorOrden<T extends string>({ value, onChange, opciones, disabled }: SelectorOrdenProps<T>) {
  return (
    <select
      className="form-select"
      style={{ minWidth: '180px' }}
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      disabled={disabled}
      aria-label="Ordenar por"
    >
      {opciones.map((opcion) => (
        <option key={opcion.valor} value={opcion.valor}>
          {opcion.etiqueta}
        </option>
      ))}
    </select>
  )
}

export default SelectorOrden
