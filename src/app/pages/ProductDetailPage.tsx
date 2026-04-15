import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CheckCircle, Leaf, ShoppingCart } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';
import type { Product } from '../types';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.products.detail(id);
        setProduct(response.product);
      } catch {
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [id]);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl text-neutral-900 mb-4">Product not found</h1>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let index = 0; index < quantity; index += 1) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <BackButton fallbackTo="/products" className="mb-6" />
      {showSuccess ? (
        <div className="fixed top-20 right-4 bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle className="w-5 h-5" />
          <span>Added to cart</span>
        </div>
      ) : null}

      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-neutral-100 rounded-[2rem] overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <div className="flex items-center gap-3 mb-3">
            <p className="text-sm text-emerald-700 uppercase tracking-[0.2em]">{product.category}</p>
            {product.badge ? (
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {product.badge}
              </span>
            ) : null}
          </div>
          <h1 className="text-4xl font-serif text-emerald-950 mb-4">{product.name}</h1>
          <p className="text-3xl text-emerald-800 font-semibold mb-6">${product.price.toFixed(2)}</p>
          <p className="text-neutral-700 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-2 text-green-700 mb-6">
            <CheckCircle className="w-5 h-5" />
            <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 text-center border border-neutral-300 rounded-lg py-2"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition flex items-center justify-center gap-2 disabled:bg-neutral-300 disabled:cursor-not-allowed mb-8"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>

          <div className="mb-8">
            <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-700" />
              Key Benefits
            </h3>
            <ul className="space-y-2">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-neutral-700">
                  <CheckCircle className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 mb-3">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="px-3 py-1 bg-emerald-50 text-emerald-800 text-sm rounded-full"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
