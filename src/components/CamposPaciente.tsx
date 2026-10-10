import type { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form'
import { OBRAS_SOCIALES, TIPOS_TELEFONO } from '../constants/pacientes'

interface CamposPacienteProps<T extends FieldValues> {
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  prefix?: string
}

function CamposPaciente<T extends FieldValues>({ register, errors, prefix = '' }: CamposPacienteProps<T>) {
  const campo = (nombre: string) => `${prefix}${nombre}` as Path<T>

  const errorDe = (nombre: string): string | undefined => {
    const partes = `${prefix}${nombre}`.split('.')
    let actual: unknown = errors
    for (const parte of partes) {
      actual = (actual as Record<string, unknown> | undefined)?.[parte]
    }
    return (actual as { message?: string } | undefined)?.message
  }

  const invalida = (nombre: string) => (errorDe(nombre) ? ' is-invalid' : '')

  return (
    <>
      <h2 className="h5 mt-4">Datos personales</h2>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}nombre`}>
            Nombre completo
          </label>
          <input
            id={`${prefix}nombre`}
            className={`form-control${invalida('nombre')}`}
            {...register(campo('nombre'))}
          />
          {errorDe('nombre') && <div className="invalid-feedback">{errorDe('nombre')}</div>}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}dni`}>
            DNI
          </label>
          <input
            id={`${prefix}dni`}
            className={`form-control${invalida('dni')}`}
            {...register(campo('dni'))}
          />
          {errorDe('dni') && <div className="invalid-feedback">{errorDe('dni')}</div>}
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor={`${prefix}email`}>
            Email
          </label>
          <input
            id={`${prefix}email`}
            type="email"
            className={`form-control${invalida('email')}`}
            {...register(campo('email'))}
          />
          {errorDe('email') && <div className="invalid-feedback">{errorDe('email')}</div>}
        </div>
      </div>

      <h2 className="h5 mt-4">Dirección</h2>
      <div className="row g-3">
        <div className="col-12 col-md-8">
          <label className="form-label" htmlFor={`${prefix}direccion.calle`}>
            Calle
          </label>
          <input
            id={`${prefix}direccion.calle`}
            className={`form-control${invalida('direccion.calle')}`}
            {...register(campo('direccion.calle'))}
          />
          {errorDe('direccion.calle') && <div className="invalid-feedback">{errorDe('direccion.calle')}</div>}
        </div>
        <div className="col-6 col-md-4">
          <label className="form-label" htmlFor={`${prefix}direccion.numero`}>
            Número
          </label>
          <input
            id={`${prefix}direccion.numero`}
            className={`form-control${invalida('direccion.numero')}`}
            {...register(campo('direccion.numero'))}
          />
          {errorDe('direccion.numero') && <div className="invalid-feedback">{errorDe('direccion.numero')}</div>}
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label" htmlFor={`${prefix}direccion.piso`}>
            Piso
          </label>
          <input
            id={`${prefix}direccion.piso`}
            className="form-control"
            {...register(campo('direccion.piso'))}
          />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label" htmlFor={`${prefix}direccion.departamento`}>
            Departamento
          </label>
          <input
            id={`${prefix}direccion.departamento`}
            className="form-control"
            {...register(campo('direccion.departamento'))}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}direccion.barrio`}>
            Barrio
          </label>
          <input
            id={`${prefix}direccion.barrio`}
            className="form-control"
            {...register(campo('direccion.barrio'))}
          />
        </div>
      </div>

      <h2 className="h5 mt-4">Teléfono</h2>
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor={`${prefix}telefono.tipo`}>
            Tipo
          </label>
          <select
            id={`${prefix}telefono.tipo`}
            className="form-select"
            {...register(campo('telefono.tipo'))}
          >
            {TIPOS_TELEFONO.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label" htmlFor={`${prefix}telefono.codigoArea`}>
            Código de área
          </label>
          <input
            id={`${prefix}telefono.codigoArea`}
            className={`form-control${invalida('telefono.codigoArea')}`}
            {...register(campo('telefono.codigoArea'))}
          />
          {errorDe('telefono.codigoArea') && <div className="invalid-feedback">{errorDe('telefono.codigoArea')}</div>}
        </div>
        <div className="col-6 col-md-5">
          <label className="form-label" htmlFor={`${prefix}telefono.numero`}>
            Número
          </label>
          <input
            id={`${prefix}telefono.numero`}
            className={`form-control${invalida('telefono.numero')}`}
            {...register(campo('telefono.numero'))}
          />
          {errorDe('telefono.numero') && <div className="invalid-feedback">{errorDe('telefono.numero')}</div>}
        </div>
      </div>

      <h2 className="h5 mt-4">Obra social</h2>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}obraSocial.nombre`}>
            Obra social
          </label>
          <select
            id={`${prefix}obraSocial.nombre`}
            className={`form-select${invalida('obraSocial.nombre')}`}
            defaultValue=""
            {...register(campo('obraSocial.nombre'))}
          >
            <option value="" disabled>
              Seleccioná una opción
            </option>
            {OBRAS_SOCIALES.map((obraSocial) => (
              <option key={obraSocial} value={obraSocial}>
                {obraSocial}
              </option>
            ))}
          </select>
          {errorDe('obraSocial.nombre') && <div className="invalid-feedback">{errorDe('obraSocial.nombre')}</div>}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}obraSocial.numeroAfiliado`}>
            Número de afiliado
          </label>
          <input
            id={`${prefix}obraSocial.numeroAfiliado`}
            className="form-control"
            {...register(campo('obraSocial.numeroAfiliado'))}
          />
        </div>
      </div>
    </>
  )
}

export default CamposPaciente
