import { Outlet, Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Leaf, Shield } from 'lucide-react';

export const RootLayout = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="w-8 h-8 text-emerald-600" />
              <span className="text-2xl font-serif text-emerald-900">Qamarun Beauty</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-neutral-700 hover:text-emerald-600 transition">
                Home
              </Link>
              <Link to="/products" className="text-neutral-700 hover:text-emerald-600 transition">
                Products
              </Link>
              {isAuthenticated && !isAdmin && (
                <Link to="/orders" className="text-neutral-700 hover:text-emerald-600 transition">
                  My Orders
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="text-neutral-700 hover:text-emerald-600 transition">
                  Dashboard
                </Link>
              )}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              {!isAdmin && (
                <Link to="/cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-neutral-700 hover:text-emerald-600 transition" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2">
                    <User className="w-5 h-5 text-neutral-600" />
                    <span className="text-sm text-neutral-700">{user?.name}</span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                        isAdmin
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isAdmin ? <Shield className="w-3 h-3" /> : <Leaf className="w-3 h-3" />}
                      {isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="hidden md:inline-flex px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 transition text-sm"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition"
                  >
                    <LogOut className="w-4 h-4 text-neutral-600" />
                    <span className="hidden md:inline text-sm text-neutral-700">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-6 h-6 text-emerald-500" />
                <span className="text-xl font-serif text-white">Qamarun Beauty</span>
              </div>
              <p className="text-sm">
                100% organic skincare products for your natural beauty routine.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Shop</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/products" className="hover:text-emerald-400 transition">All Products</Link></li>
                <li><Link to="/products?category=Cleansers" className="hover:text-emerald-400 transition">Cleansers</Link></li>
                <li><Link to="/products?category=Moisturizers" className="hover:text-emerald-400 transition">Moisturizers</Link></li>
                <li><Link to="/products?category=Serums" className="hover:text-emerald-400 transition">Serums</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">FAQs</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Shipping Info</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Returns</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">About</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition">Our Story</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Organic Certification</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Sustainability</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 Qamarun Beauty. All rights reserved. 100% Organic | Cruelty-Free | Sustainable</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
