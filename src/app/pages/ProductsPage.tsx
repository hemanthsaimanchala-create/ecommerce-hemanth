import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search } from 'lucide-react';
import { api } from '../lib/api';
import type { Product } from '../types';

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.products.list();
        setProducts(response.products);
        setCategories(response.categories);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif text-emerald-950 mb-2">Organic Skincare Catalog</h1>
        <p className="text-neutral-600">
          Browse dedicated organic skincare products with clear ingredients and benefits.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by product, ingredient, or concern"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 text-neutral-600">
        {isLoading ? 'Loading products...' : `Showing ${filteredProducts.length} products`}
      </div>

      {!isLoading && filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
          <p className="text-neutral-600">No products match the current search and category filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group"
            >
              <div className="aspect-square overflow-hidden bg-neutral-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-xs text-emerald-700 uppercase tracking-[0.2em]">
                    {product.category}
                  </p>
                  {product.badge ? (
                    <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {product.badge}
                    </span>
                  ) : null}
                </div>
                <h3 className="font-medium text-neutral-900 mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-neutral-600 mb-4 line-clamp-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg text-emerald-800 font-semibold">${product.price.toFixed(2)}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      product.inStock
                        ? 'text-green-700 bg-green-50'
                        : 'text-red-700 bg-red-50'
                    }`}
                  >
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
