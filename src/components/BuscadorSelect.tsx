import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

export interface OpcionBuscador {
  valor: string
  etiqueta: string
}

interface BuscadorSelectProps {
  id?: string
  opciones: OpcionBuscador[]
  valor: string
  onSeleccionar: (valor: string) => void
  placeholder?: string
  placeholderDeshabilitado?: string
  deshabilitado?: boolean
  error?: string
  mensajeSinOpciones?: string
}

// Combobox con texto libre: filtra las opciones a medida que se escribe
// (sin importar mayúsculas/minúsculas), igual que el buscador de paciente
// que ya existía en estas mismas pantallas. Reemplaza a un <select> nativo
// cuando hay muchas opciones y resulta más rápido escribir que desplazarse.
function BuscadorSelect({
  id,
  opciones,
  valor,
  onSeleccionar,
  placeholder = 'Escribí para buscar...',
  placeholderDeshabilitado,
  deshabilitado = false,
  error,
  mensajeSinOpciones = 'No hay opciones disponibles.',
}: BuscadorSelectProps) {
  const opcionSeleccionada = opciones.find((o) => o.valor === valor) ?? null
  const [texto, setTexto] = useState(opcionSeleccionada?.etiqueta ?? '')
  const [abierto, setAbierto] = useState(false)
  const [indiceActivo, setIndiceActivo] = useState(0)
  const contenedorRef = useRef<HTMLDivElement>(null)

  // Mantiene el texto del input sincronizado cuando la selección cambia
  // desde afuera (ej: al elegir especialidad se auto-selecciona un médico).
  useEffect(() => {
    setTexto(opcionSeleccionada?.etiqueta ?? '')
  }, [opcionSeleccionada?.etiqueta])

  useEffect(() => {
    if (deshabilitado) setAbierto(false)
  }, [deshabilitado])

  useEffect(() => {
    function manejarClickFuera(evento: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) {
        setAbierto(false)
        setTexto(opcionSeleccionada?.etiqueta ?? '')
      }
    }
    document.addEventListener('mousedown', manejarClickFuera)
    return () => document.removeEventListener('mousedown', manejarClickFuera)
  }, [opcionSeleccionada?.etiqueta])

  const coincidencias = opciones.filter((o) =>
    o.etiqueta.toLowerCase().includes(texto.trim().toLowerCase())
  )

  const seleccionar = (opcion: OpcionBuscador) => {
    onSeleccionar(opcion.valor)
    setTexto(opcion.etiqueta)
    setAbierto(false)
  }

  const manejarCambioTexto = (nuevoTexto: string) => {
    setTexto(nuevoTexto)
    setAbierto(true)
    setIndiceActivo(0)
    if (valor && nuevoTexto !== opcionSeleccionada?.etiqueta) {
      onSeleccionar('')
    }
  }

  const manejarTeclado = (evento: KeyboardEvent<HTMLInputElement>) => {
    if (!abierto && (evento.key === 'ArrowDown' || evento.key === 'ArrowUp')) {
      setAbierto(true)
      return
    }
    if (evento.key === 'ArrowDown') {
      evento.preventDefault()
      setIndiceActivo((i) => Math.min(i + 1, coincidencias.length - 1))
    } else if (evento.key === 'ArrowUp') {
      evento.preventDefault()
      setIndiceActivo((i) => Math.max(i - 1, 0))
    } else if (evento.key === 'Enter') {
      evento.preventDefault()
      const opcion = coincidencias[indiceActivo]
      if (opcion) seleccionar(opcion)
    } else if (evento.key === 'Escape') {
      setAbierto(false)
      setTexto(opcionSeleccionada?.etiqueta ?? '')
    }
  }

  return (
    <div className="buscador-select" ref={contenedorRef}>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={abierto}
        aria-autocomplete="list"
        className={`form-control${error ? ' is-invalid' : ''}`}
        placeholder={(deshabilitado && placeholderDeshabilitado) || placeholder}
        value={texto}
        disabled={deshabilitado}
        onChange={(e) => manejarCambioTexto(e.target.value)}
        onFocus={() => setAbierto(true)}
        onKeyDown={manejarTeclado}
        autoComplete="off"
      />
      {abierto && !deshabilitado && (
        <div className="buscador-select-opciones">
          {coincidencias.length > 0 ? (
            coincidencias.map((opcion, indice) => (
              <button
                type="button"
                key={opcion.valor}
                className={`buscador-select-opcion${indice === indiceActivo ? ' activa' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => seleccionar(opcion)}
                onMouseEnter={() => setIndiceActivo(indice)}
              >
                {opcion.etiqueta}
              </button>
            ))
          ) : (
            <div className="buscador-select-vacio">{mensajeSinOpciones}</div>
          )}
        </div>
      )}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  )
}

export default BuscadorSelect
