import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard } from 'lucide-react';

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCarrito, setShowCarrito] = useState(false);

  const fetchData = async () => {
    try {
      const [prodRes, ventRes] = await Promise.all([
        api.get('/productos'),
        api.get('/ventas')
      ]);
      setProductos(prodRes.data);
      setVentas(ventRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const agregarAlCarrito = (producto) => {
    const productoExistente = carrito.find(item => item.id === producto.id);
    if (productoExistente) {
      if (productoExistente.cantidad < producto.stock) {
        setCarrito(carrito.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ));
      } else {
        alert('No hay suficiente stock disponible');
      }
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }

    const producto = productos.find(p => p.id === id);
    if (nuevaCantidad > producto.stock) {
      alert('No hay suficiente stock disponible');
      return;
    }

    setCarrito(carrito.map(item =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    ));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const procesarCompra = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    setIsSubmitting(true);
    try {
      // Preparar los items para enviar al backend
      const items = carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad
      }));

      await api.post('/ventas/comprar', { items });

      alert('¡Compra realizada con éxito!');
      setCarrito([]);
      setShowCarrito(false);
      fetchData(); // Actualizar stock disponible
    } catch (error) {
      alert(error.response?.data?.message || 'Error al procesar la compra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.rol === 'admin';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isAdmin ? 'Punto de Venta' : 'Tienda - Comprar Productos'}
        </h1>
        <button
          onClick={() => setShowCarrito(!showCarrito)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 relative"
        >
          <ShoppingCart size={20} />
          Carrito
          {carrito.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {carrito.length}
            </span>
          )}
        </button>
      </div>

      {/* Carrito lateral */}
      {showCarrito && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg border-l z-50 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Carrito de Compras</h2>
            <button
              onClick={() => setShowCarrito(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {carrito.length === 0 ? (
            <p className="text-gray-500 text-center py-8">El carrito está vacío</p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {carrito.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.nombre}</h3>
                      <p className="text-sm text-gray-600">S/ {item.precio} c/u</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded p-1"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded p-1"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => eliminarDelCarrito(item.id)}
                        className="bg-red-200 hover:bg-red-300 rounded p-1 ml-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold">S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold text-green-600">S/ {calcularTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={procesarCompra}
                  disabled={isSubmitting}
                  className={`w-full bg-green-600 text-white py-3 rounded-md flex items-center justify-center gap-2 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'}`}
                >
                  <CreditCard size={20} />
                  {isSubmitting ? 'Procesando...' : 'Comprar Ahora'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Catálogo de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productos.map(producto => (
          <div key={producto.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">{producto.nombre}</h3>
              <div className="text-sm text-gray-600 mb-2">
                <p>Stock disponible: {producto.stock}</p>
                {producto.fecha_vencimiento && (
                  <p>Vence: {new Date(producto.fecha_vencimiento).toLocaleDateString()}</p>
                )}
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-green-600">S/ {producto.precio}</span>
              </div>
              <button
                onClick={() => agregarAlCarrito(producto)}
                disabled={producto.stock === 0}
                className={`w-full bg-blue-600 text-white py-2 rounded-md flex items-center justify-center gap-2 transition-colors ${producto.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                <Plus size={16} />
                {producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {productos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay productos disponibles en este momento</p>
        </div>
      )}

      {/* Historial de ventas solo para admin */}
      {isAdmin && (
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-lg font-semibold p-4 bg-gray-50 border-b">Historial de Ventas</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Venta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cobrado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha y Hora</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ventas.map(v => (
                  <tr key={v.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{v.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.producto_nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.cantidad} un.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">S/ {v.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(v.fecha).toLocaleString()}</td>
                  </tr>
                ))}
                {ventas.length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No hay ventas registradas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;