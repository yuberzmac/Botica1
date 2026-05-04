import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Plus, Trash2 } from 'lucide-react';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: '', stock: '', precio: '', fecha_vencimiento: '' });

  const fetchProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.rol === 'admin';

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/productos', form);
      setForm({ nombre: '', stock: '', precio: '', fecha_vencimiento: '' });
      fetchProductos();
    } catch (error) {
      alert('Error al agregar producto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await api.delete(`/productos/${id}`);
        fetchProductos();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Productos</h1>
      
      {isAdmin && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4">Agregar Nuevo Producto</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input type="text" required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Inicial</label>
              <input type="number" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio (S/)</label>
              <input type="number" step="0.01" required value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">F. Vencimiento</label>
              <input type="date" value={form.fecha_vencimiento} onChange={e => setForm({...form, fecha_vencimiento: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 h-[42px]">
              <Plus size={18} /> Agregar
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
              {isAdmin && <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productos.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">S/ {p.precio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.fecha_vencimiento ? new Date(p.fecha_vencimiento).toLocaleDateString() : 'N/A'}</td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {productos.length === 0 && (
              <tr><td colSpan={isAdmin ? "6" : "5"} className="px-6 py-4 text-center text-gray-500">No hay productos registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;