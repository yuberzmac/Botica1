import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Edit, Trash2 } from 'lucide-react';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ nombre_completo: '', correo: '', telefono: '', rol: 'cliente' });

  const fetchUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleEdit = (usuario) => {
    setEditingUser(usuario.id);
    setForm({
      nombre_completo: usuario.nombre_completo,
      correo: usuario.correo,
      telefono: usuario.telefono || '',
      rol: usuario.rol
    });
  };

  const handleCancel = () => {
    setEditingUser(null);
    setForm({ nombre_completo: '', correo: '', telefono: '', rol: 'cliente' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/usuarios/${editingUser}`, form);
      setEditingUser(null);
      setForm({ nombre_completo: '', correo: '', telefono: '', rol: 'cliente' });
      fetchUsuarios();
    } catch (error) {
      alert('Error al actualizar usuario');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este usuario?')) {
      try {
        await api.delete(`/usuarios/${id}`);
        fetchUsuarios();
      } catch (error) {
        alert('Error al eliminar usuario');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map(u => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {editingUser === u.id ? (
                    <input
                      type="text"
                      value={form.nombre_completo}
                      onChange={e => setForm({...form, nombre_completo: e.target.value})}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  ) : (
                    u.nombre_completo
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingUser === u.id ? (
                    <input
                      type="email"
                      value={form.correo}
                      onChange={e => setForm({...form, correo: e.target.value})}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  ) : (
                    u.correo
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingUser === u.id ? (
                    <input
                      type="tel"
                      value={form.telefono}
                      onChange={e => setForm({...form, telefono: e.target.value})}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    u.telefono || 'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingUser === u.id ? (
                    <select
                      value={form.rol}
                      onChange={e => setForm({...form, rol: e.target.value})}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="cliente">Cliente</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      u.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {u.rol}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                  {editingUser === u.id ? (
                    <>
                      <button
                        onClick={handleSubmit}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(u)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No hay usuarios registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;