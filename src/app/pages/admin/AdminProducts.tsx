import { useEffect, useMemo, useState } from 'react';
import { Edit, Plus, Search, Trash2, X } from 'lucide-react';
import { api } from '../../lib/api';
import type { Product } from '../../types';

const emptyForm = {
  name: '',
  price: '0',
  category: '',
  image: '',
  description: '',
  ingredients: '',
  benefits: '',
  badge: '',
  inStock: true,
  featured: false,
};

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageStatus, setImageStatus] = useState('No image selected');

  const loadProducts = async () => {
    try {
      const response = await api.admin.products();
      setProducts(response.products);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [products, searchQuery],
  );

  const openCreateForm = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setImageStatus('No image selected');
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: String(product.price),
      category: product.category,
      image: product.image,
      description: product.description,
      ingredients: product.ingredients.join(', '),
      benefits: product.benefits.join(', '),
      badge: product.badge || '',
      inStock: product.inStock,
      featured: Boolean(product.featured),
    });
    setImageStatus('Using current product image');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData(emptyForm);
    setImageStatus('No image selected');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setImageStatus('Please choose a JPG, PNG, WEBP, or GIF image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((current) => ({
        ...current,
        image: typeof reader.result === 'string' ? reader.result : current.image,
      }));
      setImageStatus(`Selected: ${file.name}`);
    };
    reader.onerror = () => {
      setImageStatus('Image upload failed. Please try another file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      category: formData.category.trim(),
      image: formData.image.trim(),
      description: formData.description.trim(),
      ingredients: formData.ingredients.split(',').map((item) => item.trim()).filter(Boolean),
      benefits: formData.benefits.split(',').map((item) => item.trim()).filter(Boolean),
      badge: formData.badge.trim(),
      inStock: formData.inStock,
      featured: formData.featured,
    };

    if (!payload.image) {
      setImageStatus('Please upload a product image before saving.');
      return;
    }

    try {
      if (editingProduct) {
        const response = await api.admin.updateProduct(editingProduct.id, payload);
        setProducts((current) =>
          current.map((entry) => (entry.id === editingProduct.id ? response.product : entry)),
        );
      } else {
        const response = await api.admin.createProduct(payload);
        setProducts((current) => [response.product, ...current]);
      }
      closeForm();
    } catch {
      // Keep current form state if save fails.
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Delete this product from the catalog?')) {
      return;
    }

    try {
      await api.admin.deleteProduct(productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
    } catch {
      // Ignore delete failures and leave the UI unchanged.
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-emerald-950 mb-2">Products</h1>
          <p className="text-neutral-600">Manage the organic skincare catalog from one place.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-neutral-900">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <button onClick={closeForm} className="p-2 hover:bg-neutral-100 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              placeholder="Product name"
              required
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              value={formData.price}
              onChange={(event) => setFormData({ ...formData, price: event.target.value })}
              placeholder="Price"
              type="number"
              step="0.01"
              min="0"
              required
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              value={formData.category}
              onChange={(event) => setFormData({ ...formData, category: event.target.value })}
              placeholder="Category"
              required
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              value={formData.badge}
              onChange={(event) => setFormData({ ...formData, badge: event.target.value })}
              placeholder="Badge"
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="md:col-span-2 space-y-3">
              <label className="block text-sm font-medium text-neutral-700">Product Image</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-sm text-neutral-500">
                {imageStatus}. Upload a local image file instead of pasting a link.
              </p>
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="h-32 w-32 rounded-lg object-cover border border-neutral-200"
                />
              ) : null}
            </div>
            <textarea
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              placeholder="Description"
              required
              rows={4}
              className="md:col-span-2 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <textarea
              value={formData.ingredients}
              onChange={(event) => setFormData({ ...formData, ingredients: event.target.value })}
              placeholder="Ingredients, separated by commas"
              rows={3}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <textarea
              value={formData.benefits}
              onChange={(event) => setFormData({ ...formData, benefits: event.target.value })}
              placeholder="Benefits, separated by commas"
              rows={3}
              className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(event) => setFormData({ ...formData, inStock: event.target.checked })}
              />
              In stock
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(event) => setFormData({ ...formData, featured: event.target.checked })}
              />
              Featured on homepage
            </label>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
              >
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products by name or category"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-xl" />
                      <div>
                        <p className="font-medium text-neutral-900">{product.name}</p>
                        <p className="text-sm text-neutral-500 line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 text-neutral-900">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditForm(product)}
                        className="p-2 text-emerald-700 hover:bg-emerald-50 rounded transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
