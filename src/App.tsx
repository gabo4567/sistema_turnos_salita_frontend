import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RutaProtegida from './components/RutaProtegida'
import RutaPorRol from './components/RutaPorRol'
import LayoutPrincipal from './layouts/LayoutPrincipal'
import Cargando from './components/Cargando'
import { ConfirmProvider } from './context/ConfirmProvider'

const TurnosPage = lazy(() => import('./pages/TurnosPage'))
const NuevaRecepcionPage = lazy(() => import('./pages/NuevaRecepcionPage'))
const NuevoTurnoPage = lazy(() => import('./pages/NuevoTurnoPage'))
const EditarTurnoPage = lazy(() => import('./pages/EditarTurnoPage'))
const DetalleTurnoPage = lazy(() => import('./pages/DetalleTurnoPage'))
const PacientesPage = lazy(() => import('./pages/PacientesPage'))
const EditarPacientePage = lazy(() => import('./pages/EditarPacientePage'))
const HistoriaClinicaPage = lazy(() => import('./pages/HistoriaClinicaPage'))
const MedicosPage = lazy(() => import('./pages/MedicosPage'))
const EditarMedicoPage = lazy(() => import('./pages/EditarMedicoPage'))
const ConsultoriosPage = lazy(() => import('./pages/ConsultoriosPage'))
const EditarConsultorioPage = lazy(() => import('./pages/EditarConsultorioPage'))
const PersonalPage = lazy(() => import('./pages/PersonalPage'))
const NuevoPersonalPage = lazy(() => import('./pages/NuevoPersonalPage'))
const EditarPersonalPage = lazy(() => import('./pages/EditarPersonalPage'))
const MisTurnosPage = lazy(() => import('./pages/MisTurnosPage'))
const PedirTurnoPage = lazy(() => import('./pages/PedirTurnoPage'))
const MisTurnosMedicoPage = lazy(() => import('./pages/MisTurnosMedicoPage'))
const MiPerfilMedicoPage = lazy(() => import('./pages/MiPerfilMedicoPage'))
const Login = lazy(() => import('./pages/Login'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  return (
    <ConfirmProvider>
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
              <Route element={<RutaPorRol rolesPermitidos={['admin', 'recepcionista']} />}>
                <Route index element={<TurnosPage />} />
                <Route path="nueva-recepcion" element={<NuevaRecepcionPage />} />
                <Route path="nuevo-turno" element={<NuevoTurnoPage />} />
                <Route path="turnos/:id/editar" element={<EditarTurnoPage />} />
                <Route path="turnos/:id" element={<DetalleTurnoPage />} />
                <Route path="pacientes" element={<PacientesPage />} />
                <Route path="pacientes/:dni/editar" element={<EditarPacientePage />} />
                <Route path="pacientes/:dni/historia" element={<HistoriaClinicaPage />} />
                <Route path="medicos" element={<MedicosPage />} />
                <Route path="medicos/:matricula/editar" element={<EditarMedicoPage />} />
                <Route path="consultorios" element={<ConsultoriosPage />} />
                <Route path="consultorios/:numero/editar" element={<EditarConsultorioPage />} />
              </Route>

              <Route element={<RutaPorRol rolesPermitidos={['admin']} />}>
                <Route path="personal" element={<PersonalPage />} />
                <Route path="nuevo-personal" element={<NuevoPersonalPage />} />
                <Route path="personal/:id/editar" element={<EditarPersonalPage />} />
              </Route>

              <Route element={<RutaPorRol rolesPermitidos={['paciente']} />}>
                <Route path="mis-turnos" element={<MisTurnosPage />} />
                <Route path="pedir-turno" element={<PedirTurnoPage />} />
              </Route>

              <Route element={<RutaPorRol rolesPermitidos={['medico']} />}>
                <Route path="mis-turnos-medico" element={<MisTurnosMedicoPage />} />
                <Route path="mi-perfil" element={<MiPerfilMedicoPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfirmProvider>
  )
}

export default App
