import type { FieldErrors, FieldValues, Path, UseFormRegister, UseFormWatch } from 'react-hook-form'
import { DIAS_SEMANA, generarOpcionesHorarioConCierre } from '../constants/turnos'

const opcionesHorario = generarOpcionesHorarioConCierre()

interface HorariosMedicoEditorProps<T extends FieldValues> {
  register: UseFormRegister<T>
  watch: UseFormWatch<T>
  errors?: FieldErrors<T>
}

// Tabla fija de 5 filas (lunes a viernes): el índice de cada fila coincide
// con el orden de DIAS_SEMANA, que es el mismo que arma horariosAFormulario()
// al cargar el form. Reutilizado en el alta de médico (modal y Nuevo
// Personal), Editar Médico y Mi Perfil.
function HorariosMedicoEditor<T extends FieldValues>({ register, watch, errors }: HorariosMedicoEditorProps<T>) {
  const erroresHorarios = (errors as FieldErrors<{ horarios: unknown[] }> | undefined)?.horarios as
    | { [indice: number]: { horaFin?: { message?: string } } }
    | undefined

  return (
    <div className="horarios-medico-editor">
      <h2 className="h5 mt-4">Horario de atención</h2>
      <p className="text-body-secondary small mb-2">
        Tildá los días que atiende y el rango horario. Un día sin tildar significa que no atiende ese día.
      </p>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th scope="col">Día</th>
              <th scope="col">Atiende</th>
              <th scope="col">Desde</th>
              <th scope="col">Hasta</th>
            </tr>
          </thead>
          <tbody>
            {DIAS_SEMANA.map((dia, indice) => {
              const activo = watch(`horarios.${indice}.activo` as Path<T>)
              const errorFila = erroresHorarios?.[indice]?.horaFin?.message

              return (
                <tr key={dia.valor}>
                  <td>{dia.etiqueta}</td>
                  <td>
                    <input
                      type="hidden"
                      {...register(`horarios.${indice}.diaSemana` as Path<T>, { valueAsNumber: true })}
                    />
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`horario-activo-${dia.valor}`}
                        {...register(`horarios.${indice}.activo` as Path<T>)}
                      />
                    </div>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      disabled={!activo}
                      aria-label={`Hora de inicio ${dia.etiqueta}`}
                      {...register(`horarios.${indice}.horaInicio` as Path<T>)}
                    >
                      {opcionesHorario.map((hora) => (
                        <option key={hora} value={hora}>
                          {hora}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      disabled={!activo}
                      aria-label={`Hora de fin ${dia.etiqueta}`}
                      {...register(`horarios.${indice}.horaFin` as Path<T>)}
                    >
                      {opcionesHorario.map((hora) => (
                        <option key={hora} value={hora}>
                          {hora}
                        </option>
                      ))}
                    </select>
                    {errorFila && <div className="text-danger small mt-1">{errorFila}</div>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-body-secondary small mb-0">
        Si no tildás ningún día, el médico queda sin horario cargado y no va a poder recibir turnos nuevos hasta que se configure.
      </p>
    </div>
  )
}

export default HorariosMedicoEditor
