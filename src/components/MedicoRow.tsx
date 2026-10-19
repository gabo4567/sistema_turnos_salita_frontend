import { Link } from 'react-router-dom'
import { ESPECIALIDADES } from '../constants/turnos'
import type { Medico } from '../types/Medico'
import { useConfirm } from '../hooks/useConfirm'

interface MedicoRowProps {
  medico: Medico
  onDarDeBaja: (id: string) => void
}

function MedicoRow({ medico, onDarDeBaja }: MedicoRowProps) {
  const confirmar = useConfirm()
  const nombreCompleto = `${medico.nombre} ${medico.apellido}`
  const especialidades = medico.especialidades
    .map((valor) => ESPECIALIDADES.find((e) => e.valor === valor)?.etiqueta ?? valor)
    .join(', ')

  const handleDarDeBaja = async () => {
    const ok = await confirmar(`¿Dar de baja a ${nombreCompleto}?`, {
      variante: 'peligro',
      textoConfirmar: 'Dar de baja',
    })
    if (ok) onDarDeBaja(medico.id)
  }

  return (
    <div className="ledger-row medico-row">
      <span>
        <span className="nombre d-block">{nombreCompleto}</span>
        <span className="matricula">Matrícula {medico.matricula}</span>
      </span>
      <span className="especialidad">{especialidades}</span>
      <span className="telefono">{medico.telefono || '—'}</span>
      <span className="d-flex gap-2">
        <Link to={`/medicos/${medico.matricula}/editar`} className="btn btn-outline-primary btn-sm">
          Editar
        </Link>
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={handleDarDeBaja}>
          Dar de baja
        </button>
      </span>
    </div>
  )
}

export default MedicoRow
