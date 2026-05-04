import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { AlertTriangle, Clock } from 'lucide-react';

const Alertas = () => {
  const [alertas, setAlertas] = useState({ bajoStock: [], proximosVencer: [] });

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const res = await api.get('/alertas');
        setAlertas(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAlertas();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Alertas Críticas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bajo Stock */}
        <div className="bg-white rounded-lg shadow-md border-t-4 border-red-500 overflow-hidden">
          <div className="bg-red-50 p-4 border-b flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            <h2 className="text-lg font-bold text-red-700">Productos con Bajo Stock (Menor a 5)</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {alertas.bajoStock.length === 0 ? (
              <li className="p-4 text-gray-500">No hay productos con bajo stock.</li>
            ) : (
              alertas.bajoStock.map(p => (
                <li key={p.id} className="p-4 flex justify-between items-center">
                  <span className="font-medium">{p.nombre}</span>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold">
                    Stock actual: {p.stock}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Próximos a Vencer */}
        <div className="bg-white rounded-lg shadow-md border-t-4 border-yellow-500 overflow-hidden">
          <div className="bg-yellow-50 p-4 border-b flex items-center gap-2">
            <Clock className="text-yellow-600" />
            <h2 className="text-lg font-bold text-yellow-700">Próximos a Vencer (30 días)</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {alertas.proximosVencer.length === 0 ? (
              <li className="p-4 text-gray-500">No hay productos próximos a vencer.</li>
            ) : (
              alertas.proximosVencer.map(p => (
                <li key={p.id} className="p-4 flex justify-between items-center">
                  <span className="font-medium">{p.nombre}</span>
                  <span className="text-sm text-gray-600">
                    Vence: {new Date(p.fecha_vencimiento).toLocaleDateString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
        
      </div>
    </div>
  );
};

export default Alertas;