import { useState } from 'react'
import TurnosPage from './pages/TurnosPage'
import AltaPacientePage from './pages/AltaPacientePage'

function App() {
  const [pagina, setPagina] = useState('turnos')

  return (
    <>
      <nav className="container d-flex gap-2 pt-4">
        <button
          type="button"
          className={`btn btn-sm ${pagina === 'turnos' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setPagina('turnos')}
        >
          Turnos
        </button>
        <button
          type="button"
          className={`btn btn-sm ${pagina === 'alta' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setPagina('alta')}
        >
          Nuevo Paciente
        </button>
      </nav>
      {pagina === 'turnos' ? <TurnosPage /> : <AltaPacientePage />}
    </>
  )
}

export default App
