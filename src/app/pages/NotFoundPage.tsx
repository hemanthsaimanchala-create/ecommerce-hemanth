import { Link } from 'react-router';
import { AlertCircle } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center">
        <BackButton fallbackTo="/" className="mb-6" />
        <AlertCircle className="w-24 h-24 text-emerald-600 mx-auto mb-6" />
        <h1 className="text-6xl font-serif text-emerald-900 mb-4">404</h1>
        <h2 className="text-2xl text-neutral-900 mb-4">Page Not Found</h2>
        <p className="text-neutral-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};
