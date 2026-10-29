import { Link } from 'react-router-dom'
import { ESPECIALIDADES } from '../constants/turnos'
import type { Consultorio } from '../types/Consultorio'
import { useConfirm } from '../hooks/useConfirm'

interface ConsultorioRowProps {
  consultorio: Consultorio
  onDarDeBaja: (id: string) => void
}

function ConsultorioRow({ consultorio, onDarDeBaja }: ConsultorioRowProps) {
  const confirmar = useConfirm()
  const especialidad = ESPECIALIDADES.find((e) => e.valor === consultorio.especialidad)?.etiqueta

  const handleDarDeBaja = async () => {
    const ok = await confirmar(`¿Dar de baja el consultorio ${consultorio.numero}?`, {
      variante: 'peligro',
      textoConfirmar: 'Dar de baja',
    })
    if (ok) onDarDeBaja(consultorio.id)
  }

  return (
    <div className="ledger-row consultorio-row">
      <span className="numero">
        Consultorio {consultorio.numero}
        {consultorio.activo === false && <span className="badge-estado cancelado ms-2">Inactivo</span>}
      </span>
      <span className="piso">{consultorio.piso ? `Piso ${consultorio.piso}` : '—'}</span>
      <span className="especialidad">{especialidad ?? 'General'}</span>
      <span className="d-flex gap-2">
        <Link
          to={`/consultorios/${consultorio.numero}/editar`}
          className="btn btn-outline-primary btn-sm"
        >
          Editar
        </Link>
        {consultorio.activo !== false && (
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleDarDeBaja}>
            Dar de baja
          </button>
        )}
      </span>
    </div>
  )
}

export default ConsultorioRow
