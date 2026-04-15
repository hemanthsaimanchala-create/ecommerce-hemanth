import express from 'express';
import { randomUUID } from 'crypto';
import {
  addActivity,
  createOrder,
  createPasswordReset,
  createProduct,
  createSession,
  createUser,
  deleteSessionsByUserId,
  deleteProduct,
  deleteSession,
  ensureDb,
  getActivePasswordReset,
  getOrderById,
  getOrders,
  getOrdersByUserId,
  getProductById,
  getProducts,
  getRecentActivity,
  getSessionWithUser,
  getUserByEmail,
  getUserById,
  getUsers,
  hashPassword,
  invalidatePasswordResetsForUser,
  markPasswordResetUsed,
  sanitizeUser,
  trimActivity,
  updateOrderStatus,
  updateOrderStatusAndReason,
  updateProduct,
  updateUserPassword,
  updateUser,
} from './db.js';
import { sendOtpEmail, sendOrderStatusEmail } from './mailer.js';

const app = express();
const PORT = process.env.PORT || 4000;
const TAX_RATE = 0.08;
const OTP_EXPIRY_MINUTES = 10;

ensureDb();

app.use(express.json({ limit: '10mb' }));

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
};

const buildOrderResponse = (order) => ({
  ...order,
  itemsCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
});

const requireAuth = (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const sessionUser = getSessionWithUser(token);
  if (!sessionUser) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  if (sessionUser.status !== 'active') {
    return res.status(401).json({ message: 'Your account is inactive.' });
  }

  req.user = {
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
    password_hash: sessionUser.password_hash,
    role: sessionUser.role,
    status: sessionUser.status,
    registered_date: sessionUser.registered_date,
  };
  req.session = {
    token: sessionUser.token,
    createdAt: sessionUser.created_at,
  };
  return next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  return next();
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'qamarun-beauty-api', database: 'sqlite' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body ?? {};
  const trimmedName = String(name || '').trim();
  const trimmedEmail = String(email || '').trim().toLowerCase();

  if (!trimmedName || !trimmedEmail || String(password || '').length < 6) {
    return res.status(400).json({ message: 'Please provide a valid name, email, and password.' });
  }

  const existingUser = getUserByEmail(trimmedEmail);
  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const user = {
    id: randomUUID(),
    name: trimmedName,
    email: trimmedEmail,
    passwordHash: hashPassword(password),
    role: 'user',
    status: 'active',
    registeredDate: new Date().toISOString(),
  };
  createUser(user);

  const token = randomUUID();
  createSession({ token, userId: user.id, createdAt: new Date().toISOString() });
  addActivity('user', `${user.name} created a new account.`);
  trimActivity();

  res.status(201).json({
    token,
    user: sanitizeUser({
      ...user,
      registered_date: user.registeredDate,
    }),
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body ?? {};
  const trimmedEmail = String(email || '').trim().toLowerCase();
  const user = getUserByEmail(trimmedEmail);

  if (!user || user.password_hash !== hashPassword(String(password || ''))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ message: 'This account is inactive. Please contact an administrator.' });
  }

  const token = randomUUID();
  createSession({ token, userId: user.id, createdAt: new Date().toISOString() });
  addActivity('auth', `${user.email} signed in.`);
  trimActivity();

  res.json({ token, user: sanitizeUser(user) });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ message: 'Please enter your email address.' });
  }

  const user = getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ message: 'No account was found for that email address.' });
  }

  invalidatePasswordResetsForUser(user.id);

  const otpCode = String(Math.floor(100000 + Math.random() * 900000));
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

  createPasswordReset({
    id: randomUUID(),
    userId: user.id,
    otpCode,
    expiresAt,
    createdAt,
  });

  const delivery = await sendOtpEmail({ to: user.email, otpCode });
  addActivity('auth', `${user.email} requested a password reset OTP.`);
  trimActivity();

  return res.json({
    message:
      delivery.mode === 'smtp'
        ? 'OTP sent to your email address.'
        : 'OTP generated. SMTP is not configured, so the OTP was written to server/data/mailbox.log for local testing.',
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const otpCode = String(req.body?.otpCode || '').trim();
  const newPassword = String(req.body?.newPassword || '');

  if (!email || !otpCode || newPassword.length < 6) {
    return res.status(400).json({ message: 'Please provide email, OTP, and a new password.' });
  }

  const passwordReset = getActivePasswordReset({ email, otpCode });
  if (!passwordReset) {
    return res.status(400).json({ message: 'Invalid OTP or email.' });
  }

  if (new Date(passwordReset.expires_at).getTime() < Date.now()) {
    return res.status(400).json({ message: 'This OTP has expired. Please request a new one.' });
  }

  updateUserPassword({
    id: passwordReset.user_id,
    passwordHash: hashPassword(newPassword),
  });
  markPasswordResetUsed(passwordReset.id);
  deleteSessionsByUserId(passwordReset.user_id);
  addActivity('auth', `${email} reset their password with OTP.`);
  trimActivity();

  return res.json({ message: 'Password reset successful. You can now sign in.' });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  deleteSession(req.session.token);
  addActivity('auth', `${req.user.email} signed out.`);
  trimActivity();
  res.status(204).send();
});

app.get('/api/products', (req, res) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const category = String(req.query.category || '').trim();
  const allProducts = getProducts();

  const products = allProducts.filter((product) => {
    const matchesCategory = !category || category === 'All' || product.category === category;
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.ingredients.some((ingredient) => ingredient.toLowerCase().includes(search));

    return matchesCategory && matchesSearch;
  });

  res.json({
    products,
    categories: ['All', ...new Set(allProducts.map((product) => product.category))],
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  res.json({ product });
});

app.post('/api/orders', requireAuth, async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty.' });
  }

  const normalizedItems = items
    .map((item) => {
      const product = getProductById(item.id);
      if (!product) {
        return null;
      }

      const quantity = Math.max(1, Number(item.quantity) || 1);
      return {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity,
      };
    })
    .filter(Boolean);

  if (normalizedItems.length === 0) {
    return res.status(400).json({ message: 'No valid products were found in the cart.' });
  }

  const address = {
    name: String(shippingAddress?.name || '').trim(),
    address: String(shippingAddress?.address || '').trim(),
    city: String(shippingAddress?.city || '').trim(),
    zipCode: String(shippingAddress?.zipCode || '').trim(),
    email: String(shippingAddress?.email || '').trim(),
  };

  if (!address.name || !address.address || !address.city || !address.zipCode || !address.email) {
    return res.status(400).json({ message: 'Please complete the shipping information.' });
  }

  const allowedPaymentMethods = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'];
  if (!allowedPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({ message: 'Please select a payment method.' });
  }

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const order = {
    id: `ORD-${Date.now()}`,
    userId: req.user.id,
    userName: req.user.name,
    userEmail: req.user.email,
    date: new Date().toISOString(),
    status: 'Processing',
    items: normalizedItems,
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    total,
    paymentMethod,
    cancelReason: null,
    shippingAddress: address,
  };

  createOrder(order);
  addActivity('order', `${req.user.email} placed order ${order.id}.`);
  trimActivity();
  await sendOrderStatusEmail({
    to: req.user.email,
    orderId: order.id,
    status: order.status,
    cancelReason: null,
  });

  res.status(201).json({ order: buildOrderResponse(order) });
});

app.get('/api/orders/me', requireAuth, (req, res) => {
  const orders = getOrdersByUserId(req.user.id).map(buildOrderResponse);
  res.json({ orders });
});

app.patch('/api/orders/:id/cancel', requireAuth, (req, res) => {
  const cancelReason = String(req.body?.cancelReason || '').trim();
  const existingOrder = getOrderById(req.params.id);

  if (!existingOrder || existingOrder.userId !== req.user.id) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  if (existingOrder.status !== 'Processing') {
    return res.status(400).json({ message: 'Only processing orders can be cancelled by the customer.' });
  }

  if (!cancelReason) {
    return res.status(400).json({ message: 'Please tell us why you want to cancel this order.' });
  }

  updateOrderStatusAndReason({
    id: existingOrder.id,
    status: 'Cancelled',
    cancelReason,
  });
  const updatedOrder = getOrderById(existingOrder.id);
  addActivity('order', `${req.user.email} cancelled order ${updatedOrder.id}.`);
  trimActivity();
  void sendOrderStatusEmail({
    to: req.user.email,
    orderId: updatedOrder.id,
    status: updatedOrder.status,
    cancelReason,
  });

  res.json({ order: buildOrderResponse(updatedOrder) });
});

app.get('/api/admin/summary', requireAuth, requireAdmin, (_req, res) => {
  const orders = getOrders();
  const products = getProducts();
  const users = getUsers();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue: Number(totalRevenue.toFixed(2)),
    recentActivity: getRecentActivity(8).map((activity) => ({
      id: activity.id,
      type: activity.type,
      message: activity.message,
      createdAt: activity.created_at,
    })),
  });
});

app.get('/api/admin/products', requireAuth, requireAdmin, (_req, res) => {
  res.json({ products: getProducts() });
});

app.post('/api/admin/products', requireAuth, requireAdmin, (req, res) => {
  const payload = req.body ?? {};
  const product = {
    id: randomUUID(),
    name: String(payload.name || '').trim(),
    price: Number(payload.price || 0),
    description: String(payload.description || '').trim(),
    ingredients: Array.isArray(payload.ingredients) ? payload.ingredients.filter(Boolean) : [],
    benefits: Array.isArray(payload.benefits) ? payload.benefits.filter(Boolean) : [],
    image: String(payload.image || '').trim(),
    category: String(payload.category || '').trim(),
    inStock: Boolean(payload.inStock),
    badge: String(payload.badge || '').trim(),
    featured: Boolean(payload.featured),
  };

  if (!product.name || !product.description || !product.image || !product.category || product.price <= 0) {
    return res.status(400).json({ message: 'Please provide complete product details.' });
  }

  createProduct(product);
  addActivity('product', `${req.user.email} added product ${product.name}.`);
  trimActivity();
  res.status(201).json({ product });
});

app.put('/api/admin/products/:id', requireAuth, requireAdmin, (req, res) => {
  const currentProduct = getProductById(req.params.id);
  if (!currentProduct) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const payload = req.body ?? {};
  const product = {
    ...currentProduct,
    ...payload,
    id: currentProduct.id,
    name: String(payload.name ?? currentProduct.name).trim(),
    price: Number(payload.price ?? currentProduct.price),
    description: String(payload.description ?? currentProduct.description).trim(),
    ingredients: Array.isArray(payload.ingredients) ? payload.ingredients.filter(Boolean) : currentProduct.ingredients,
    benefits: Array.isArray(payload.benefits) ? payload.benefits.filter(Boolean) : currentProduct.benefits,
    image: String(payload.image ?? currentProduct.image).trim(),
    category: String(payload.category ?? currentProduct.category).trim(),
    inStock: typeof payload.inStock === 'boolean' ? payload.inStock : currentProduct.inStock,
    badge: String(payload.badge ?? currentProduct.badge).trim(),
    featured: typeof payload.featured === 'boolean' ? payload.featured : currentProduct.featured,
  };

  updateProduct(product);
  addActivity('product', `${req.user.email} updated product ${product.name}.`);
  trimActivity();
  res.json({ product });
});

app.delete('/api/admin/products/:id', requireAuth, requireAdmin, (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  deleteProduct(req.params.id);
  addActivity('product', `${req.user.email} deleted product ${product.name}.`);
  trimActivity();
  res.status(204).send();
});

app.get('/api/admin/users', requireAuth, requireAdmin, (_req, res) => {
  res.json({ users: getUsers().map(sanitizeUser) });
});

app.patch('/api/admin/users/:id', requireAuth, requireAdmin, (req, res) => {
  const user = getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const { role, status } = req.body ?? {};
  if (role && !['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role.' });
  }
  if (status && !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' });
  }

  updateUser({ id: user.id, role, status });
  const updatedUser = getUserById(user.id);
  addActivity('user', `${req.user.email} updated user ${user.email}.`);
  trimActivity();
  res.json({ user: sanitizeUser(updatedUser) });
});

app.get('/api/admin/orders', requireAuth, requireAdmin, (_req, res) => {
  res.json({ orders: getOrders().map(buildOrderResponse) });
});

app.patch('/api/admin/orders/:id', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body ?? {};
  if (!['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid order status.' });
  }

  const existingOrder = getOrderById(req.params.id);
  if (!existingOrder) {
    return res.status(404).json({ message: 'Order not found.' });
  }

  updateOrderStatus(req.params.id, status);
  const updatedOrder = getOrderById(req.params.id);
  addActivity('order', `${req.user.email} changed ${updatedOrder.id} to ${status}.`);
  trimActivity();
  await sendOrderStatusEmail({
    to: updatedOrder.userEmail,
    orderId: updatedOrder.id,
    status: updatedOrder.status,
    cancelReason: updatedOrder.cancelReason,
  });
  res.json({ order: buildOrderResponse(updatedOrder) });
});

app.listen(PORT, () => {
  console.log(`Qamarun Beauty API running on http://localhost:${PORT} with SQLite`);
});
