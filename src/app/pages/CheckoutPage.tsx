import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Smartphone, Landmark, Truck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { BackButton } from '../components/BackButton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';
import type { Order } from '../types';

const paymentMethods: Array<{
  value: Order['paymentMethod'];
  label: string;
  description: string;
  Icon: typeof CreditCard;
}> = [
  {
    value: 'Credit Card',
    label: 'Credit Card',
    description: 'Visa, Mastercard, RuPay and other mock credit card payments.',
    Icon: CreditCard,
  },
  {
    value: 'Debit Card',
    label: 'Debit Card',
    description: 'Pay using your bank debit card in demo mode.',
    Icon: CreditCard,
  },
  {
    value: 'UPI',
    label: 'UPI',
    description: 'Mock Google Pay, PhonePe, Paytm or any UPI app.',
    Icon: Smartphone,
  },
  {
    value: 'Net Banking',
    label: 'Net Banking',
    description: 'Simulated bank portal payment for academic demonstration.',
    Icon: Landmark,
  },
  {
    value: 'Cash on Delivery',
    label: 'Cash on Delivery',
    description: 'Place the order now and mark payment as cash on delivery.',
    Icon: Truck,
  },
];

export const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'Credit Card' as Order['paymentMethod'],
  });

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate('/admin');
    }
  }, [authLoading, isAdmin, navigate]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=checkout');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!authLoading && items.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [authLoading, items.length, navigate, orderComplete]);

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      fullName: user?.name || current.fullName,
      email: user?.email || current.email,
    }));
  }, [user]);

  if (isAdmin) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
      await api.orders.create({
        items,
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          name: formData.fullName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        },
      });
      clearCart();
      setOrderComplete(true);
      toast.success(`Order placed successfully with ${formData.paymentMethod}.`);
      window.setTimeout(() => navigate('/orders'), 2200);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Checkout failed.';
      setError(message);
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-700" />
          </div>
          <h1 className="text-3xl font-serif text-emerald-950 mb-4">Order Confirmed</h1>
          <p className="text-neutral-600 mb-4">
            Your order was placed successfully using {formData.paymentMethod} and saved in your order history.
          </p>
          <p className="text-sm text-neutral-500">Redirecting to your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackButton fallbackTo="/cart" className="mb-6" />
      <h1 className="text-3xl font-serif text-emerald-950 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Shipping Information</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                  required
                  placeholder="Full Name"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  required
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                  required
                  placeholder="Street address"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(event) => setFormData({ ...formData, city: event.target.value })}
                    required
                    placeholder="City"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(event) => setFormData({ ...formData, zipCode: event.target.value })}
                    required
                    placeholder="ZIP Code"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-900">
                Demo mode: choose any payment option below. No real payment is processed.
              </div>

              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              ) : null}

              <div className="space-y-3">
                {paymentMethods.map(({ value, label, description, Icon }) => (
                  <label
                    key={value}
                    className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition ${
                      formData.paymentMethod === value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-neutral-200 hover:border-emerald-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={formData.paymentMethod === value}
                      onChange={() => setFormData({ ...formData, paymentMethod: value })}
                      className="mt-1"
                    />
                    <Icon className="w-5 h-5 text-emerald-700 mt-0.5" />
                    <div>
                      <p className="font-medium text-neutral-900">{label}</p>
                      <p className="text-sm text-neutral-600">{description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-700">
                Selected method: <span className="font-semibold text-neutral-900">{formData.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm gap-4">
                    <span className="text-neutral-600">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="text-neutral-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax</span>
                  <span>${(totalPrice * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-neutral-900 pt-2">
                  <span>Total</span>
                  <span>${(totalPrice * 1.08).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition disabled:bg-neutral-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
