import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RutaProtegida from './components/RutaProtegida'
import LayoutPrincipal from './layouts/LayoutPrincipal'
import Cargando from './components/Cargando'

const TurnosPage = lazy(() => import('./pages/TurnosPage'))
const AltaPacientePage = lazy(() => import('./pages/AltaPacientePage'))
const NuevaRecepcionPage = lazy(() => import('./pages/NuevaRecepcionPage'))
const NuevoTurnoPage = lazy(() => import('./pages/NuevoTurnoPage'))
const PacientesPage = lazy(() => import('./pages/PacientesPage'))
const EditarPacientePage = lazy(() => import('./pages/EditarPacientePage'))
const HistoriaClinicaPage = lazy(() => import('./pages/HistoriaClinicaPage'))
const MedicosPage = lazy(() => import('./pages/MedicosPage'))
const NuevoMedicoPage = lazy(() => import('./pages/NuevoMedicoPage'))
const EditarMedicoPage = lazy(() => import('./pages/EditarMedicoPage'))
const ConsultoriosPage = lazy(() => import('./pages/ConsultoriosPage'))
const NuevoConsultorioPage = lazy(() => import('./pages/NuevoConsultorioPage'))
const EditarConsultorioPage = lazy(() => import('./pages/EditarConsultorioPage'))
const Login = lazy(() => import('./pages/Login'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="login"
          element={
            <Suspense fallback={<Cargando />}>
              <Login />
            </Suspense>
          }
        />
        <Route element={<RutaProtegida />}>
          <Route element={<LayoutPrincipal />}>
            <Route index element={<TurnosPage />} />
            <Route path="nueva-recepcion" element={<NuevaRecepcionPage />} />
            <Route path="nuevo-turno" element={<NuevoTurnoPage />} />
            <Route path="pacientes" element={<PacientesPage />} />
            <Route path="pacientes/:dni/editar" element={<EditarPacientePage />} />
            <Route path="pacientes/:dni/historia" element={<HistoriaClinicaPage />} />
            <Route path="nuevo-paciente" element={<AltaPacientePage />} />
            <Route path="medicos" element={<MedicosPage />} />
            <Route path="nuevo-medico" element={<NuevoMedicoPage />} />
            <Route path="medicos/:matricula/editar" element={<EditarMedicoPage />} />
            <Route path="consultorios" element={<ConsultoriosPage />} />
            <Route path="nuevo-consultorio" element={<NuevoConsultorioPage />} />
            <Route path="consultorios/:numero/editar" element={<EditarConsultorioPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
