import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../context/auth-context'

// Protege rutas: si no hay usuario con sesión, lo manda al login
export default function PrivateRoute({ children }) {
  const { usuario } = useAuth()
  return usuario ? children : <Navigate to="/login" />
}

PrivateRoute.propTypes = {
  children: PropTypes.node,
}
