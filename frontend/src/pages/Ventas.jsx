import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ShoppingCart } from 'lucide-react';

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [form, setForm] = useState({ producto_id: '', cantidad: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await api.post('/ventas', form);
      alert('Venta registrada con éxito. ¡Stock descontado!');
      setForm({ producto_id: '', cantidad: 1 });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al registrar venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Punto de Venta</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">Registrar Nueva Venta</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Seleccionar Producto</label>
            <select 
              required 
              value={form.producto_id} 
              onChange={e => setForm({...form, producto_id: e.target.value})} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
            >
              <option value="">-- Seleccione --</option>
              {productos.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre} (Stock: {p.stock} | Precio: S/{p.precio})
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input 
              type="number" 
              min="1" 
              required 
              value={form.cantidad} 
              onChange={e => setForm({...form, cantidad: e.target.value})} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" 
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-green-600 text-white px-6 py-2 rounded-md flex items-center gap-2 h-[42px] transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'}`}
          >
            <ShoppingCart size={18} /> {isSubmitting ? 'Registrando...' : 'Vender'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-lg font-semibold p-4 bg-gray-50 border-b">Historial de Ventas</h2>
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
  );
};

export default Ventas;