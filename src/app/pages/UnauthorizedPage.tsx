import { Link } from 'react-router';
import { ShieldAlert } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-lg text-center bg-white rounded-2xl shadow-sm p-10">
        <BackButton fallbackTo="/" className="mb-6" />
        <ShieldAlert className="w-20 h-20 text-amber-600 mx-auto mb-6" />
        <h1 className="text-4xl font-serif text-emerald-950 mb-4">Access Restricted</h1>
        <p className="text-neutral-600 mb-8">
          This section is available only to administrators. User accounts can continue shopping,
          managing carts, and viewing order history from the storefront.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="px-6 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
          >
            Go to Store
          </Link>
          <Link
            to="/orders"
            className="px-6 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
          >
            My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};
