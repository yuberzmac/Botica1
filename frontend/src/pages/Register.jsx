import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const [form, setForm] = useState({
    nombre_completo: '',
    correo: '',
    telefono: '',
    password: '',
    confirmar_password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (form.password !== form.confirmar_password) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/auth/register', form);
      setSuccess('¡Cuenta creada con éxito! Redirigiendo...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error de conexión con el servidor.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-4 rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Crear cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Únete a la nueva experiencia de Botica Nova Salud
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-5" onSubmit={handleRegister}>
          
          {/* Alertas */}
          {error && (
            <div className="bg-red-50/80 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-pulse">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50/80 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
              {success}
            </div>
          )}

          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Nombre Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-600">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                </div>
                <input
                  type="text"
                  name="nombre_completo"
                  required
                  className="pl-11 block w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                  placeholder="Ej. Juan Pérez"
                  value={form.nombre_completo}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Correo Electrónico</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                </div>
                <input
                  type="email"
                  name="correo"
                  required
                  className="pl-11 block w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                  placeholder="juan@ejemplo.com"
                  value={form.correo}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Teléfono</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                </div>
                <input
                  type="tel"
                  name="telefono"
                  className="pl-11 block w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                  placeholder="999 888 777"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Contraseña</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    className="pl-11 block w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Confirmar</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                  </div>
                  <input
                    type="password"
                    name="confirmar_password"
                    required
                    className="pl-11 block w-full bg-gray-50/50 border border-gray-200 rounded-xl py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none"
                    placeholder="••••••••"
                    value={form.confirmar_password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botón Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70"
            >
              {isLoading ? 'Creando cuenta...' : 'Registrar Cuenta'}
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium tracking-wide">O continuar con</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Fallo el registro con Google')}
              shape="rectangular"
              size="large"
              text="signup_with"
              width="300"
            />
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Inicia sesión
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;