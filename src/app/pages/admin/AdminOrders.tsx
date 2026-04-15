import { useEffect, useState } from 'react';
import { Eye, Package } from 'lucide-react';
import { api } from '../../lib/api';
import type { Order } from '../../types';

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.admin.orders();
        setOrders(response.orders);
      } catch {
        setOrders([]);
      }
    };

    void loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await api.admin.updateOrder(orderId, newStatus);
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? response.order : order)),
      );
      setSelectedOrder((current) => (current?.id === orderId ? response.order : current));
    } catch {
      // Keep the previous UI state if the request fails.
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-emerald-950 mb-2">Orders</h1>
        <p className="text-neutral-600">Review customer purchases and update their fulfillment status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600">No orders have been placed yet.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-2xl shadow-sm p-6 cursor-pointer transition ${
                  selectedOrder?.id === order.id ? 'ring-2 ring-emerald-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-neutral-900">{order.id}</p>
                    <p className="text-sm text-neutral-500">{new Date(order.date).toLocaleString()}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                    {order.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-neutral-600">{order.itemsCount} items</p>
                    <p className="font-semibold text-neutral-900">${order.total.toFixed(2)}</p>
                  </div>
                  <Eye className="w-5 h-5 text-emerald-700" />
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            {selectedOrder ? (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Order Details</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-neutral-500">Customer</p>
                    <p className="font-medium text-neutral-900">{selectedOrder.userName}</p>
                    <p className="text-sm text-neutral-600">{selectedOrder.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Status</p>
                    <select
                      value={selectedOrder.status}
                      onChange={(event) =>
                        handleUpdateStatus(selectedOrder.id, event.target.value as Order['status'])
                      }
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <h3 className="font-semibold text-neutral-900 mb-3">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={`${selectedOrder.id}-${item.id}`} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900 text-sm">{item.name}</p>
                          <p className="text-sm text-neutral-600">Qty: {item.quantity}</p>
                          <p className="text-sm text-emerald-800 font-semibold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <h3 className="font-semibold text-neutral-900 mb-3">Shipping Address</h3>
                  <p className="text-sm text-neutral-700">
                    {selectedOrder.shippingAddress.name}
                    <br />
                    {selectedOrder.shippingAddress.address}
                    <br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}
                    <br />
                    {selectedOrder.shippingAddress.email}
                  </p>
                </div>

                {selectedOrder.status === 'Cancelled' && selectedOrder.cancelReason ? (
                  <div className="border-t pt-4 mb-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Cancellation Reason</h3>
                    <p className="text-sm text-neutral-700">{selectedOrder.cancelReason}</p>
                  </div>
                ) : null}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-neutral-900 pt-2">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600">Select an order to review its details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
