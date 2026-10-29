import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { crearPaciente } from '../api/pacientesApi'
import { extraerMensajesError } from '../api/httpClient'
import CamposPaciente from './CamposPaciente'
import { PacienteSchema, type PacienteFormValues } from '../schemas/paciente.schema'
import type { Paciente } from '../types/Paciente'

interface PacienteFormProps {
  onCancel?: () => void
  onCreated?: (paciente: Paciente) => void
}

const valoresIniciales: PacienteFormValues = {
  nombre: '',
  dni: '',
  direccion: { calle: '', numero: '', piso: '', departamento: '', barrio: '' },
  email: '',
  telefono: { tipo: 'CELULAR', codigoArea: '', numero: '' },
  obraSocial: { nombre: '' as PacienteFormValues['obraSocial']['nombre'], numeroAfiliado: '' },
}

function PacienteForm({ onCancel, onCreated }: PacienteFormProps) {
  const [errores, setErrores] = useState<string[]>([])
  const [pacienteCreado, setPacienteCreado] = useState<Paciente | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PacienteFormValues>({
    resolver: zodResolver(PacienteSchema),
    defaultValues: valoresIniciales,
  })

  const onSubmit = async (datos: PacienteFormValues) => {
    setErrores([])
    setPacienteCreado(null)

    try {
      const paciente = await crearPaciente(datos)
      setPacienteCreado(paciente)
      onCreated?.(paciente)
      reset(valoresIniciales)
    } catch (error) {
      setErrores(extraerMensajesError(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-start" noValidate>
      {pacienteCreado && (
        <div className="alert alert-success" role="alert">
          Paciente <strong>{pacienteCreado.nombre}</strong> creado exitosamente
          (DNI {pacienteCreado.dni}).
        </div>
      )}

      {errores.length > 0 && (
        <div className="alert alert-danger" role="alert">
          <p className="fw-semibold mb-1">No se pudo crear el paciente:</p>
          <ul className="mb-0 ps-3">
            {errores.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <CamposPaciente register={register} errors={errors} />

      <div className="d-flex gap-2 mt-4">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Dar de alta paciente'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline-danger" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default PacienteForm
