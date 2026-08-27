import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LayoutPrincipal from './layouts/LayoutPrincipal'
import TurnosPage from './pages/TurnosPage'
import AltaPacientePage from './pages/AltaPacientePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutPrincipal />}>
          <Route index element={<TurnosPage />} />
          <Route path="nuevo-paciente" element={<AltaPacientePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
