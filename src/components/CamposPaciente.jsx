import { OBRAS_SOCIALES, TIPOS_TELEFONO } from '../constants/pacientes'

function CamposPaciente({ valores, prefix = '', onChange }) {
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
            name={`${prefix}nombre`}
            className="form-control"
            value={valores.nombre}
            onChange={onChange}
            required
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}dni`}>
            DNI
          </label>
          <input
            id={`${prefix}dni`}
            name={`${prefix}dni`}
            className="form-control"
            value={valores.dni}
            onChange={onChange}
            pattern="[0-9]{7,8}"
            title="7 u 8 dígitos"
            required
          />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor={`${prefix}email`}>
            Email
          </label>
          <input
            id={`${prefix}email`}
            name={`${prefix}email`}
            type="email"
            className="form-control"
            value={valores.email}
            onChange={onChange}
            required
          />
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
            name={`${prefix}direccion.calle`}
            className="form-control"
            value={valores.direccion.calle}
            onChange={onChange}
            required
          />
        </div>
        <div className="col-6 col-md-4">
          <label className="form-label" htmlFor={`${prefix}direccion.numero`}>
            Número
          </label>
          <input
            id={`${prefix}direccion.numero`}
            name={`${prefix}direccion.numero`}
            className="form-control"
            value={valores.direccion.numero}
            onChange={onChange}
            required
          />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label" htmlFor={`${prefix}direccion.piso`}>
            Piso
          </label>
          <input
            id={`${prefix}direccion.piso`}
            name={`${prefix}direccion.piso`}
            className="form-control"
            value={valores.direccion.piso}
            onChange={onChange}
          />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label" htmlFor={`${prefix}direccion.departamento`}>
            Departamento
          </label>
          <input
            id={`${prefix}direccion.departamento`}
            name={`${prefix}direccion.departamento`}
            className="form-control"
            value={valores.direccion.departamento}
            onChange={onChange}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}direccion.barrio`}>
            Barrio
          </label>
          <input
            id={`${prefix}direccion.barrio`}
            name={`${prefix}direccion.barrio`}
            className="form-control"
            value={valores.direccion.barrio}
            onChange={onChange}
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
            name={`${prefix}telefono.tipo`}
            className="form-select"
            value={valores.telefono.tipo}
            onChange={onChange}
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
            name={`${prefix}telefono.codigoArea`}
            className="form-control"
            value={valores.telefono.codigoArea}
            onChange={onChange}
            pattern="[0-9]{2,5}"
            title="2 a 5 dígitos"
            required
          />
        </div>
        <div className="col-6 col-md-5">
          <label className="form-label" htmlFor={`${prefix}telefono.numero`}>
            Número
          </label>
          <input
            id={`${prefix}telefono.numero`}
            name={`${prefix}telefono.numero`}
            className="form-control"
            value={valores.telefono.numero}
            onChange={onChange}
            pattern="[0-9]{7,10}"
            title="7 a 10 dígitos"
            required
          />
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
            name={`${prefix}obraSocial.nombre`}
            className="form-select"
            value={valores.obraSocial.nombre}
            onChange={onChange}
            required
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
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor={`${prefix}obraSocial.numeroAfiliado`}>
            Número de afiliado
          </label>
          <input
            id={`${prefix}obraSocial.numeroAfiliado`}
            name={`${prefix}obraSocial.numeroAfiliado`}
            className="form-control"
            value={valores.obraSocial.numeroAfiliado}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  )
}

export default CamposPaciente
