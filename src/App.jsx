import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LayoutPrincipal from './layouts/LayoutPrincipal'
import TurnosPage from './pages/TurnosPage'
import AltaPacientePage from './pages/AltaPacientePage'
import NuevaRecepcionPage from './pages/NuevaRecepcionPage'
import NuevoTurnoPage from './pages/NuevoTurnoPage'
import PacientesPage from './pages/PacientesPage'
import EditarPacientePage from './pages/EditarPacientePage'
import HistoriaClinicaPage from './pages/HistoriaClinicaPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutPrincipal />}>
          <Route index element={<TurnosPage />} />
          <Route path="nueva-recepcion" element={<NuevaRecepcionPage />} />
          <Route path="nuevo-turno" element={<NuevoTurnoPage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="pacientes/:dni/editar" element={<EditarPacientePage />} />
          <Route path="pacientes/:dni/historia" element={<HistoriaClinicaPage />} />
          <Route path="nuevo-paciente" element={<AltaPacientePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
