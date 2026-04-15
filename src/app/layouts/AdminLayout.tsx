import { Outlet, Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Leaf } from 'lucide-react';
import { useEffect } from 'react';

export const AdminLayout = () => {
  const { user, logout, isAdmin, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=admin');
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      navigate('/unauthorized');
    }
  }, [isAdmin, isAuthenticated, isLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading admin panel...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-900 text-white flex flex-col">
        <div className="p-6 border-b border-emerald-800">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="w-8 h-8" />
            <span className="text-xl font-serif">Qamarun Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition"
              >
                <Package className="w-5 h-5" />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition"
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-emerald-300">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-emerald-800 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
