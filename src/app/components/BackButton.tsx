import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface BackButtonProps {
  fallbackTo?: string;
  label?: string;
  className?: string;
}

export const BackButton = ({
  fallbackTo = '/',
  label = 'Back',
  className = '',
}: BackButtonProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleBack = () => {
    if (isAdmin) {
      navigate('/admin');
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
};
