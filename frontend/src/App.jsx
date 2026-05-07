import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import NavBar from './components/Navbar'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Dashboard from './pages/Dashboard'
import Pacientes from './pages/Pacientes'
import NuevoPaciente from './pages/NuevoPaciente'
import Historial from './pages/Historial'
import AnalisisRetinaPage from './pages/AnalisisRetinaPage'
import ReportesPdf from './pages/ReportesPdf'
import ReportesPdfPaciente from './pages/ReportesPdfPaciente'
import AsistenteUron from './components/AsistenteUron'
import 'bootstrap/dist/css/bootstrap.min.css'

function Layout({ children }) {
  return (
    <>
      <NavBar />
      <main className="app-layout-shell">
        <div className="container-fluid app-layout-content">{children}</div>
      </main>
    </>
  )
}

function AppContent() {
  const location = useLocation()

  const enLogin    = location.pathname === '/login'
  const enRegistro = location.pathname === '/registro'

  return (
    <>
      {enLogin    && <AsistenteUron modo="login" />}
      {enRegistro && <AsistenteUron modo="registro" />}

      <Routes>
        {/* ── Rutas públicas ── */}
        <Route path="/login"    element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* ── Rutas protegidas ── */}
        <Route path="/" element={
          <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>
        }/>

        <Route path="/pacientes" element={
          <PrivateRoute><Layout><Pacientes /></Layout></PrivateRoute>
        }/>

        <Route path="/pacientes/nuevo" element={
          <PrivateRoute><Layout><NuevoPaciente /></Layout></PrivateRoute>
        }/>

        <Route path="/historial/:pacienteId" element={
          <PrivateRoute><Layout><Historial /></Layout></PrivateRoute>
        }/>

        <Route path="/reportes-pdf" element={
          <PrivateRoute><Layout><ReportesPdf /></Layout></PrivateRoute>
        }/>

        <Route path="/reportes-pdf/:pacienteId" element={
          <PrivateRoute><Layout><ReportesPdfPaciente /></Layout></PrivateRoute>
        }/>

        {/* ── Retina: sin Layout para que use su propio diseño full-page ── */}
        <Route path="/retina" element={
          <PrivateRoute><AnalisisRetinaPage /></PrivateRoute>
        }/>

      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}