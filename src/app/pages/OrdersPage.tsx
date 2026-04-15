import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AlertCircle, Package, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { Order } from '../types';

export const OrdersPage = () => {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate('/admin');
      return;
    }

    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=orders');
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    const loadOrders = async () => {
      try {
        const response = await api.orders.mine();
        setOrders(response.orders);
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, [authLoading, isAdmin, isAuthenticated, navigate]);

  if (isAdmin) {
    return null;
  }

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif text-emerald-950 mb-8">My Orders</h1>
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <ShoppingBag className="w-24 h-24 text-neutral-300 mx-auto mb-6" />
          <h2 className="text-2xl font-serif text-neutral-900 mb-4">No orders yet</h2>
          <p className="text-neutral-600 mb-8">Your past purchases will appear here after checkout.</p>
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
          >
            Shop Products
          </Link>
        </div>
      </div>
    );
  }

  const handleCancelOrder = async (orderId: string) => {
    setCancelError('');

    if (!cancelReason.trim()) {
      setCancelError('Please enter a reason before cancelling the order.');
      toast.error('Please enter a cancellation reason.');
      return;
    }

    try {
      setIsCancelling(true);
      const response = await api.orders.cancel(orderId, cancelReason.trim());
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? response.order : order)),
      );
      setCancelOrderId(null);
      setCancelReason('');
      toast.success(`Order ${orderId} has been cancelled.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel the order.';
      setCancelError(message);
      toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif text-emerald-950 mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-neutral-50 px-6 py-4 border-b">
              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Order ID</p>
                  <p className="font-medium text-neutral-900">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Date</p>
                  <p className="font-medium text-neutral-900">{new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Total</p>
                  <p className="font-medium text-neutral-900">${order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 uppercase">Status</p>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.id}`} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">{item.name}</h3>
                      <p className="text-sm text-neutral-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-emerald-800 font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-neutral-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 mb-1">Shipping Address</p>
                    <p className="text-sm text-neutral-600">
                      {order.shippingAddress.name}
                      <br />
                      {order.shippingAddress.address}
                      <br />
                      {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              {order.status === 'Cancelled' && order.cancelReason ? (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm font-medium text-neutral-900 mb-1">Cancellation Reason</p>
                  <p className="text-sm text-neutral-600">{order.cancelReason}</p>
                </div>
              ) : null}

              {order.status === 'Processing' ? (
                <div className="mt-6 pt-6 border-t">
                  {cancelOrderId === order.id ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-neutral-900">Cancel this order</p>
                      <textarea
                        value={cancelReason}
                        onChange={(event) => setCancelReason(event.target.value)}
                        placeholder="Tell us why you want to cancel this order"
                        rows={3}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {cancelError ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-red-800">{cancelError}</p>
                        </div>
                      ) : null}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={isCancelling}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCancelOrderId(null);
                            setCancelReason('');
                            setCancelError('');
                          }}
                          disabled={isCancelling}
                          className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
                        >
                          Keep Order
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setCancelOrderId(order.id);
                        setCancelReason('');
                        setCancelError('');
                      }}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
