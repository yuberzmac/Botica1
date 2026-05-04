import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, AlertTriangle, LogOut, LayoutDashboard, Users } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.rol === 'admin';
  const isSeller = user.rol === 'vendedor';

  const navLinks = [];

  if (isAdmin) {
    navLinks.push(
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Productos', path: '/productos', icon: Package },
      { name: 'Ventas', path: '/ventas', icon: ShoppingCart },
      { name: 'Alertas', path: '/alertas', icon: AlertTriangle },
      { name: 'Usuarios', path: '/usuarios', icon: Users }
    );
  } else if (isSeller) {
    navLinks.push(
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Productos', path: '/productos', icon: Package },
      { name: 'Punto de Venta', path: '/ventas', icon: ShoppingCart },
      { name: 'Alertas', path: '/alertas', icon: AlertTriangle }
    );
  } else {
    // Solo clientes pueden acceder a ventas para comprar
    navLinks.push({ name: 'Comprar', path: '/ventas', icon: ShoppingCart });
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <ShoppingCart className="w-8 h-8" />
            <span className="font-bold text-xl">Nova Salud</span>
          </div>
          
          <div className="flex space-x-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;