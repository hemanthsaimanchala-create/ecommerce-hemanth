# Qamarun Beauty SQLite Schema

The backend now uses a real SQLite database file at `server/data/qamarun.db`.

## Tables

### `users`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT | Primary key |
| `name` | TEXT | Full name |
| `email` | TEXT | Unique login email |
| `password_hash` | TEXT | Hashed password |
| `role` | TEXT | `user` or `admin` |
| `status` | TEXT | `active` or `inactive` |
| `registered_date` | TEXT | ISO datetime |

### `sessions`

| Column | Type | Notes |
| --- | --- | --- |
| `token` | TEXT | Primary key |
| `user_id` | TEXT | References `users.id` |
| `created_at` | TEXT | ISO datetime |

### `products`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT | Primary key |
| `name` | TEXT | Product name |
| `price` | REAL | Product price |
| `description` | TEXT | Product description |
| `ingredients` | TEXT | JSON array |
| `benefits` | TEXT | JSON array |
| `image` | TEXT | Product image URL |
| `category` | TEXT | Product category |
| `in_stock` | INTEGER | `1` or `0` |
| `badge` | TEXT | Optional product badge |
| `featured` | INTEGER | `1` or `0` |

### `orders`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT | Primary key |
| `user_id` | TEXT | References `users.id` |
| `user_name` | TEXT | Customer name snapshot |
| `user_email` | TEXT | Customer email snapshot |
| `date` | TEXT | ISO datetime |
| `status` | TEXT | `Processing`, `Shipped`, `Delivered`, `Cancelled` |
| `items` | TEXT | JSON array of purchased items |
| `subtotal` | REAL | Order subtotal |
| `tax` | REAL | Tax amount |
| `total` | REAL | Final total |
| `payment_method` | TEXT | Mock payment label |
| `shipping_address` | TEXT | JSON shipping object |

### `activity`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT | Primary key |
| `type` | TEXT | Activity type |
| `message` | TEXT | Human-readable log |
| `created_at` | TEXT | ISO datetime |
