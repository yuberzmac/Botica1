import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Ventas from './pages/Ventas';
import Alertas from './pages/Alertas';
import Usuarios from './pages/Usuarios';

const ProtectedLayout = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

const RequireAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.rol !== 'admin') {
    return <Navigate to="/ventas" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/ventas" replace />} />
          <Route path="/dashboard" element={
            <RequireAdmin>
              <Dashboard />
            </RequireAdmin>
          } />
          <Route path="/productos" element={
            <RequireAdmin>
              <Productos />
            </RequireAdmin>
          } />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/alertas" element={
            <RequireAdmin>
              <Alertas />
            </RequireAdmin>
          } />
          <Route path="/usuarios" element={
            <RequireAdmin>
              <Usuarios />
            </RequireAdmin>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;