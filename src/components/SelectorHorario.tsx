import { useEffect, useState } from 'react'
import { getDisponibilidad } from '../api/turnosApi'
import { generarHorariosDelDia } from '../constants/turnos'
import { esFechaDeHoy, horaActualRedondeada } from '../utils/fecha'

interface SelectorHorarioProps {
  medicoId: string
  fecha: string
  horaSeleccionada: string
  onSeleccionar: (hora: string) => void
  error?: string
}

const horarios = generarHorariosDelDia()

function SelectorHorario({ medicoId, fecha, horaSeleccionada, onSeleccionar, error }: SelectorHorarioProps) {
  const [ocupados, setOcupados] = useState<string[]>([])
  const [cargando, setCargando] = useState(false)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)

  useEffect(() => {
    if (!medicoId || !fecha) {
      setOcupados([])
      return
    }

    let cancelado = false
    setCargando(true)
    setErrorCarga(null)

    getDisponibilidad(medicoId, fecha)
      .then((respuesta) => {
        if (!cancelado) setOcupados(respuesta.ocupados)
      })
      .catch(() => {
        if (!cancelado) setErrorCarga('No se pudo cargar la disponibilidad del médico.')
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })

    return () => {
      cancelado = true
    }
  }, [medicoId, fecha])

  if (!medicoId || !fecha) {
    return <p className="text-body-secondary mb-0">Elegí médico y fecha para ver los horarios disponibles.</p>
  }

  if (cargando) {
    return <p className="text-body-secondary mb-0">Cargando horarios disponibles...</p>
  }

  if (errorCarga) {
    return <p className="text-danger mb-0">{errorCarga}</p>
  }

  const esHoy = esFechaDeHoy(fecha)
  const horaActual = horaActualRedondeada()

  return (
    <div>
      <div className="selector-horario-leyenda mb-2">
        <span className="leyenda-item">
          <span className="leyenda-punto leyenda-libre" /> Libre
        </span>
        <span className="leyenda-item">
          <span className="leyenda-punto leyenda-ocupado" /> Ocupado
        </span>
        {esHoy && (
          <span className="leyenda-item">
            <span className="leyenda-punto leyenda-pasado" /> Ya pasó
          </span>
        )}
      </div>

      <div className="selector-horario-grilla">
        {horarios.map((horario) => {
          const pasado = esHoy && horario < horaActual
          const ocupado = ocupados.includes(horario)
          const seleccionado = horario === horaSeleccionada

          let claseEstado = 'btn-outline-success'
          if (seleccionado) claseEstado = 'btn-primary'
          else if (pasado) claseEstado = 'btn-outline-secondary'
          else if (ocupado) claseEstado = 'btn-outline-danger'

          return (
            <button
              key={horario}
              type="button"
              className={`btn btn-sm ${claseEstado}`}
              disabled={pasado || ocupado}
              onClick={() => onSeleccionar(horario)}
            >
              {horario}
            </button>
          )
        })}
      </div>

      {error && <div className="text-danger small mt-2">{error}</div>}
    </div>
  )
}

export default SelectorHorario
