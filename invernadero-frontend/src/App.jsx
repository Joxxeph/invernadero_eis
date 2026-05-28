import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Menu from "./layout/Menu";
import BDDiagram from "./pages/BDDiagram";
import Forms from "./pages/Forms";
import EntidadesInfo from "./pages/EntidadesInfo";
import TipoIdentificacionForm from "./pages/TipoIdentificacionForm";
import TipoIdentificacionTable from "./components/TipoIdentificacionTable";
import TipoCultivoForm from "./pages/TipoCultivoForm";
import CultivoForm from "./pages/CultivoForm";
import ProductoForm from "./pages/ProductoForm";
import PersonaForm from "./pages/PersonaForm";
import ClienteForm from "./pages/ClienteForm";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import PrivateRoute from "./pages/PrivateRoute";
import Profile from "./pages/Profile";
import OAuthPage from "./pages/OauthPage" 
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/oauth-success" element={<OAuthPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Menu />
          </PrivateRoute>
        }
      >
        {" "}
        <Route index element={<Navigate to="diagram" />} />
        <Route path="miPerfil" element={<Profile />} />
        <Route path="diagrama" element={<BDDiagram />} />
        <Route path="formulariosBD" element={<Forms />} />
        <Route path="informacionEntidades" element={<EntidadesInfo />} />
        <Route
          path="tipo-identificacion-form"
          element={<TipoIdentificacionForm />}
        />
        <Route path="tipo-cultivo-form" element={<TipoCultivoForm />} />
        <Route
          path="tipo-identificacion-table"
          element={<TipoIdentificacionTable />}
        />
        <Route path="cultivo-form" element={<CultivoForm />} />
        <Route path="producto-form" element={<ProductoForm />} />
        <Route path="persona-form" element={<PersonaForm />} />
        <Route path="cliente-form" element={<ClienteForm />} />
      </Route>
    </Routes>
  );
};

export default App;
