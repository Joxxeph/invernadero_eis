import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
/**
 * Componente de protección de rutas privadas.
 * Permite acceso solo a usuarios autenticados.
 */

/**
 * @file PrivateRoute.jsx
 * @description Componente de protección de rutas basado en autenticación.
 */
/**
 /**
 * @component PrivateRoute
 * @description Permite acceso a rutas solo si el usuario está autenticado.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos protegidos
 */
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;