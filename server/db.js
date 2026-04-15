import fs from 'fs';
import path from 'path';
import { randomUUID, scryptSync } from 'crypto';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DB_PATH = path.join(__dirname, 'data', 'qamarun.db');
export const MAILBOX_LOG_PATH = path.join(__dirname, 'data', 'mailbox.log');

const seedProducts = [
  {
    id: 'prod-1',
    name: 'Organic Rose Water Toner',
    price: 24.99,
    description:
      'Pure organic rose water toner to refresh and balance your skin. Handcrafted with Bulgarian rose petals.',
    ingredients: ['Organic Rose Water', 'Aloe Vera Extract', 'Vitamin E', 'Vegetable Glycerin'],
    benefits: ['Hydrates skin', 'Balances pH', 'Reduces redness', 'Rich in antioxidants'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
    category: 'Toners',
    inStock: true,
    badge: 'Best Seller',
    featured: true,
  },
  {
    id: 'prod-2',
    name: 'Green Tea Facial Cleanser',
    price: 29.99,
    description:
      'A gentle cleanser infused with organic green tea and chamomile to remove impurities without stripping moisture.',
    ingredients: ['Green Tea Extract', 'Chamomile Oil', 'Jojoba Oil', 'Coconut-Derived Cleanser'],
    benefits: ['Deep cleansing', 'Soothes irritation', 'Supports clear skin', 'Suitable for daily use'],
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800',
    category: 'Cleansers',
    inStock: true,
    badge: 'Sensitive Skin',
    featured: true,
  },
  {
    id: 'prod-3',
    name: 'Lavender Night Cream',
    price: 39.99,
    description:
      'A nourishing night cream with organic lavender, shea butter, and argan oil for overnight skin repair.',
    ingredients: ['Lavender Essential Oil', 'Shea Butter', 'Argan Oil', 'Vitamin C'],
    benefits: ['Deep moisturization', 'Supports overnight repair', 'Softens texture', 'Calming aroma'],
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800',
    category: 'Moisturizers',
    inStock: true,
    badge: 'Night Care',
    featured: true,
  },
  {
    id: 'prod-4',
    name: 'Turmeric Glow Face Mask',
    price: 34.99,
    description:
      'A brightening mask made with organic turmeric and raw honey to revive dull, uneven skin.',
    ingredients: ['Organic Turmeric', 'Raw Honey', 'Kaolin Clay', 'Yogurt Ferment'],
    benefits: ['Brightens complexion', 'Helps calm inflammation', 'Supports even tone', 'Natural glow boost'],
    image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=800',
    category: 'Masks',
    inStock: true,
    badge: 'Glow Boost',
    featured: true,
  },
  {
    id: 'prod-5',
    name: 'Vitamin C Radiance Serum',
    price: 44.99,
    description:
      'A potent serum featuring vitamin C, rosehip oil, and hyaluronic acid to brighten and smooth skin.',
    ingredients: ['Vitamin C', 'Rosehip Oil', 'Hyaluronic Acid', 'Ferulic Acid'],
    benefits: ['Brightens tone', 'Reduces fine lines', 'Boosts collagen support', 'Improves hydration'],
    image: 'https://images.unsplash.com/photo-1620916297991-f49084d0e723?w=800',
    category: 'Serums',
    inStock: true,
    badge: 'Radiance',
    featured: false,
  },
  {
    id: 'prod-6',
    name: 'Pure Aloe Recovery Gel',
    price: 19.99,
    description:
      'Cooling aloe vera gel that hydrates and comforts skin after sun exposure or irritation.',
    ingredients: ['Pure Aloe Vera', 'Vitamin E', 'Green Tea Extract'],
    benefits: ['Intense hydration', 'Soothes heat stress', 'Helps calm breakouts', 'Fast-absorbing'],
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
    category: 'Treatments',
    inStock: true,
    badge: 'Daily Essential',
    featured: false,
  },
  {
    id: 'prod-7',
    name: 'Coffee Body Polish',
    price: 27.99,
    description:
      'An exfoliating body scrub with organic coffee grounds and coconut oil for smooth, energized skin.',
    ingredients: ['Organic Coffee Grounds', 'Coconut Oil', 'Brown Sugar', 'Vanilla Extract'],
    benefits: ['Exfoliates gently', 'Smooths rough texture', 'Improves circulation feel', 'Leaves skin soft'],
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800',
    category: 'Body Care',
    inStock: true,
    badge: 'Spa Favorite',
    featured: false,
  },
  {
    id: 'prod-8',
    name: 'Argan Repair Elixir',
    price: 32.99,
    description:
      'A lightweight argan treatment that nourishes dry ends and adds shine to hair and beard care routines.',
    ingredients: ['Pure Argan Oil', 'Vitamin E', 'Omega Fatty Acids'],
    benefits: ['Adds shine', 'Helps reduce frizz', 'Nourishes dry strands', 'Multi-use treatment'],
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800',
    category: 'Hair Care',
    inStock: true,
    badge: 'Multi-Use',
    featured: false,
  },
];

export const hashPassword = (password) => {
  const salt = 'qamarun-demo-salt';
  return scryptSync(password, salt, 64).toString('hex');
};

export const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  registeredDate: user.registered_date,
});

let db;

const parseList = (value) => {
  if (!value) {
    return [];
  }
  return JSON.parse(value);
};

const mapProduct = (row) => ({
  id: row.id,
  name: row.name,
  price: row.price,
  description: row.description,
  ingredients: parseList(row.ingredients),
  benefits: parseList(row.benefits),
  image: row.image,
  category: row.category,
  inStock: Boolean(row.in_stock),
  badge: row.badge || '',
  featured: Boolean(row.featured),
});

const mapOrder = (row) => ({
  id: row.id,
  userId: row.user_id,
  userName: row.user_name,
  userEmail: row.user_email,
  date: row.date,
  status: row.status,
  items: parseList(row.items),
  subtotal: row.subtotal,
  tax: row.tax,
  total: row.total,
  paymentMethod: row.payment_method,
  cancelReason: row.cancel_reason || null,
  shippingAddress: parseList(row.shipping_address),
});

const seedDatabase = () => {
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, status, registered_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertUser.run(
      'user-admin',
      'Admin User',
      'admin@qamarun.com',
      hashPassword('admin123'),
      'admin',
      'active',
      '2026-01-01T00:00:00.000Z',
    );
    insertUser.run(
      'user-demo',
      'Jane Doe',
      'user@example.com',
      hashPassword('user123'),
      'user',
      'active',
      '2026-02-15T00:00:00.000Z',
    );
  }

  const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
  if (productCount === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, name, price, description, ingredients, benefits, image, category, in_stock, badge, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const product of seedProducts) {
      insertProduct.run(
        product.id,
        product.name,
        product.price,
        product.description,
        JSON.stringify(product.ingredients),
        JSON.stringify(product.benefits),
        product.image,
        product.category,
        Number(product.inStock),
        product.badge,
        Number(product.featured),
      );
    }
  }

  const activityCount = db.prepare('SELECT COUNT(*) AS count FROM activity').get().count;
  if (activityCount === 0) {
    db.prepare(`
      INSERT INTO activity (id, type, message, created_at)
      VALUES (?, ?, ?, ?)
    `).run(randomUUID(), 'system', 'SQLite database seeded for Qamarun Beauty demo.', new Date().toISOString());
  }
};

export const ensureDb = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new DatabaseSync(DB_PATH);
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
      status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
      registered_date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      benefits TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      in_stock INTEGER NOT NULL DEFAULT 1,
      badge TEXT,
      featured INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('Processing', 'Shipped', 'Delivered', 'Cancelled')),
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      total REAL NOT NULL,
      payment_method TEXT NOT NULL,
      cancel_reason TEXT,
      shipping_address TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS activity (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  const orderColumns = db.prepare("PRAGMA table_info(orders)").all();
  if (!orderColumns.some((column) => column.name === 'cancel_reason')) {
    db.exec('ALTER TABLE orders ADD COLUMN cancel_reason TEXT');
  }

  seedDatabase();
};

export const getDb = () => {
  if (!db) {
    ensureDb();
  }
  return db;
};

export const addActivity = (type, message) => {
  getDb()
    .prepare('INSERT INTO activity (id, type, message, created_at) VALUES (?, ?, ?, ?)')
    .run(randomUUID(), type, message, new Date().toISOString());
};

export const trimActivity = () => {
  getDb().exec(`
    DELETE FROM activity
    WHERE id NOT IN (
      SELECT id FROM activity
      ORDER BY datetime(created_at) DESC
      LIMIT 20
    )
  `);
};

export const getUserByEmail = (email) =>
  getDb().prepare('SELECT * FROM users WHERE lower(email) = lower(?)').get(email);

export const getUserById = (id) => getDb().prepare('SELECT * FROM users WHERE id = ?').get(id);

export const updateUserPassword = ({ id, passwordHash }) => {
  getDb().prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, id);
};

export const createUser = ({ id, name, email, passwordHash, role, status, registeredDate }) => {
  getDb()
    .prepare(`
      INSERT INTO users (id, name, email, password_hash, role, status, registered_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(id, name, email, passwordHash, role, status, registeredDate);
};

export const createSession = ({ token, userId, createdAt }) => {
  getDb()
    .prepare('INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)')
    .run(token, userId, createdAt);
};

export const getSessionWithUser = (token) =>
  getDb()
    .prepare(`
      SELECT
        s.token,
        s.created_at,
        u.id,
        u.name,
        u.email,
        u.password_hash,
        u.role,
        u.status,
        u.registered_date
      FROM sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token = ?
    `)
    .get(token);

export const deleteSession = (token) => {
  getDb().prepare('DELETE FROM sessions WHERE token = ?').run(token);
};

export const deleteSessionsByUserId = (userId) => {
  getDb().prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
};

export const createPasswordReset = ({ id, userId, otpCode, expiresAt, createdAt }) => {
  getDb()
    .prepare(`
      INSERT INTO password_resets (id, user_id, otp_code, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(id, userId, otpCode, expiresAt, createdAt);
};

export const invalidatePasswordResetsForUser = (userId) => {
  getDb()
    .prepare('UPDATE password_resets SET used_at = ? WHERE user_id = ? AND used_at IS NULL')
    .run(new Date().toISOString(), userId);
};

export const getActivePasswordReset = ({ email, otpCode }) =>
  getDb()
    .prepare(`
      SELECT
        pr.id,
        pr.user_id,
        pr.otp_code,
        pr.expires_at,
        pr.used_at,
        u.email
      FROM password_resets pr
      JOIN users u ON u.id = pr.user_id
      WHERE lower(u.email) = lower(?) AND pr.otp_code = ? AND pr.used_at IS NULL
      ORDER BY datetime(pr.created_at) DESC
      LIMIT 1
    `)
    .get(email, otpCode);

export const markPasswordResetUsed = (id) => {
  getDb().prepare('UPDATE password_resets SET used_at = ? WHERE id = ?').run(new Date().toISOString(), id);
};

export const getProducts = () =>
  getDb()
    .prepare('SELECT * FROM products ORDER BY featured DESC, name ASC')
    .all()
    .map(mapProduct);

export const getProductById = (id) => {
  const row = getDb().prepare('SELECT * FROM products WHERE id = ?').get(id);
  return row ? mapProduct(row) : null;
};

export const createProduct = (product) => {
  getDb()
    .prepare(`
      INSERT INTO products (
        id, name, price, description, ingredients, benefits, image, category, in_stock, badge, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      product.id,
      product.name,
      product.price,
      product.description,
      JSON.stringify(product.ingredients),
      JSON.stringify(product.benefits),
      product.image,
      product.category,
      Number(product.inStock),
      product.badge,
      Number(product.featured),
    );
};

export const updateProduct = (product) => {
  getDb()
    .prepare(`
      UPDATE products
      SET name = ?, price = ?, description = ?, ingredients = ?, benefits = ?, image = ?, category = ?,
          in_stock = ?, badge = ?, featured = ?
      WHERE id = ?
    `)
    .run(
      product.name,
      product.price,
      product.description,
      JSON.stringify(product.ingredients),
      JSON.stringify(product.benefits),
      product.image,
      product.category,
      Number(product.inStock),
      product.badge,
      Number(product.featured),
      product.id,
    );
};

export const deleteProduct = (id) => {
  getDb().prepare('DELETE FROM products WHERE id = ?').run(id);
};

export const getUsers = () =>
  getDb()
    .prepare('SELECT * FROM users ORDER BY datetime(registered_date) DESC')
    .all();

export const updateUser = ({ id, role, status }) => {
  if (role !== undefined) {
    getDb().prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
  }
  if (status !== undefined) {
    getDb().prepare('UPDATE users SET status = ? WHERE id = ?').run(status, id);
  }
};

export const createOrder = (order) => {
  getDb()
    .prepare(`
      INSERT INTO orders (
        id, user_id, user_name, user_email, date, status, items, subtotal, tax, total, payment_method, cancel_reason, shipping_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      order.id,
      order.userId,
      order.userName,
      order.userEmail,
      order.date,
      order.status,
      JSON.stringify(order.items),
      order.subtotal,
      order.tax,
      order.total,
      order.paymentMethod,
      order.cancelReason || null,
      JSON.stringify(order.shippingAddress),
    );
};

export const getOrders = () =>
  getDb()
    .prepare('SELECT * FROM orders ORDER BY datetime(date) DESC')
    .all()
    .map(mapOrder);

export const getOrdersByUserId = (userId) =>
  getDb()
    .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY datetime(date) DESC')
    .all(userId)
    .map(mapOrder);

export const getOrderById = (id) => {
  const row = getDb().prepare('SELECT * FROM orders WHERE id = ?').get(id);
  return row ? mapOrder(row) : null;
};

export const updateOrderStatus = (id, status) => {
  getDb().prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
};

export const updateOrderStatusAndReason = ({ id, status, cancelReason = null }) => {
  getDb()
    .prepare('UPDATE orders SET status = ?, cancel_reason = ? WHERE id = ?')
    .run(status, cancelReason, id);
};

export const getRecentActivity = (limit = 8) =>
  getDb()
    .prepare('SELECT * FROM activity ORDER BY datetime(created_at) DESC LIMIT ?')
    .all(limit);
