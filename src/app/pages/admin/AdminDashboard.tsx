import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { DollarSign, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { api } from '../../lib/api';
import type { ActivityItem } from '../../types';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await api.admin.summary();
        setStats({
          totalProducts: response.totalProducts,
          totalOrders: response.totalOrders,
          totalUsers: response.totalUsers,
          totalRevenue: response.totalRevenue,
        });
        setRecentActivity(response.recentActivity);
      } catch {
        setRecentActivity([]);
      }
    };

    void loadSummary();
  }, []);

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-100 text-blue-600', link: '/admin/products' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-emerald-100 text-emerald-700', link: '/admin/orders' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-amber-100 text-amber-700', link: '/admin/users' },
    { title: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-rose-100 text-rose-700' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-emerald-950 mb-2">Dashboard</h1>
        <p className="text-neutral-600">Monitor products, orders, users, and recent platform activity.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition">
            {stat.link ? (
              <Link to={stat.link} className="block">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-semibold text-neutral-900 mb-1">{stat.value}</p>
                <p className="text-sm text-neutral-600">{stat.title}</p>
              </Link>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl font-semibold text-neutral-900 mb-1">{stat.value}</p>
                <p className="text-sm text-neutral-600">{stat.title}</p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="border-b border-neutral-100 pb-4 last:border-b-0 last:pb-0">
                <p className="text-sm text-neutral-900">{activity.message}</p>
                <p className="text-xs text-neutral-500 mt-1">{new Date(activity.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/admin/products" className="p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-400 transition text-center">
              <Package className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
              <p className="font-medium text-neutral-900">Manage Products</p>
            </Link>
            <Link to="/admin/orders" className="p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-400 transition text-center">
              <ShoppingBag className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
              <p className="font-medium text-neutral-900">Track Orders</p>
            </Link>
            <Link to="/admin/users" className="p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-400 transition text-center">
              <Users className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
              <p className="font-medium text-neutral-900">Manage Users</p>
            </Link>
            <Link to="/" className="p-4 border-2 border-emerald-200 rounded-lg hover:border-emerald-400 transition text-center">
              <Package className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
              <p className="font-medium text-neutral-900">View Store</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
