import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    ventasRealizadas: 0,
    alertasActivas: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productosRes, ventasRes, alertasRes] = await Promise.all([
          api.get('/productos'),
          api.get('/ventas'),
          api.get('/alertas')
        ]);
        
        setStats({
          totalProductos: productosRes.data.length,
          ventasRealizadas: ventasRes.data.length,
          alertasActivas: alertasRes.data.bajoStock.length + alertasRes.data.proximosVencer.length
        });
      } catch (error) {
        console.error("Error cargando estadísticas", error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel Principal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 border-l-4 border-blue-500">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold">Total Productos</p>
            <h3 className="text-2xl font-bold">{stats.totalProductos}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 border-l-4 border-green-500">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold">Ventas Realizadas</p>
            <h3 className="text-2xl font-bold">{stats.ventasRealizadas}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4 border-l-4 border-red-500">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-semibold">Alertas Activas</p>
            <h3 className="text-2xl font-bold">{stats.alertasActivas}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;