import { useEffect, useState } from 'react'
import { getDisponibilidad } from '../api/turnosApi'
import { esFechaDeHoy, horaActualRedondeada } from '../utils/fecha'
import { horariosDelMedicoParaFecha } from '../utils/horariosMedico'
import type { Medico } from '../types/Medico'

interface SelectorHorarioProps {
  medico: Medico | undefined
  fecha: string
  horaSeleccionada: string
  onSeleccionar: (hora: string) => void
  error?: string
  // Al editar un turno existente: no cuenta su propio horario como ocupado.
  excluirTurnoId?: string
}

function SelectorHorario({ medico, fecha, horaSeleccionada, onSeleccionar, error, excluirTurnoId }: SelectorHorarioProps) {
  const medicoId = medico?.id
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

    getDisponibilidad(medicoId, fecha, excluirTurnoId)
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
  }, [medicoId, fecha, excluirTurnoId])

  if (!medicoId || !fecha) {
    return <p className="text-body-secondary mb-0">Elegí médico y fecha para ver los horarios disponibles.</p>
  }

  if (cargando) {
    return <p className="text-body-secondary mb-0">Cargando horarios disponibles...</p>
  }

  if (errorCarga) {
    return <p className="text-danger mb-0">{errorCarga}</p>
  }

  const horarios = horariosDelMedicoParaFecha(medico, fecha)

  if (horarios.length === 0) {
    return <p className="text-body-secondary mb-0">El médico no atiende ese día. Elegí otra fecha.</p>
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
