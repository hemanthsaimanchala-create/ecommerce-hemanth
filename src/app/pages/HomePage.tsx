import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ChevronLeft, ChevronRight, Heart, Leaf, Shield, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import type { Product } from '../types';

const featureCards = [
  {
    title: '100% Organic',
    description: 'Dedicated catalog for organic skincare products only',
    Icon: Leaf,
  },
  {
    title: 'Cruelty-Free',
    description: 'Ethical formulas chosen for conscious skincare routines',
    Icon: Heart,
  },
  {
    title: 'Clear Ingredients',
    description: 'Transparent product benefits, usage, and ingredient lists',
    Icon: Shield,
  },
  {
    title: 'Glow Naturally',
    description: 'Botanical skincare made for daily confidence',
    Icon: Sparkles,
  },
];

const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200',
    alt: 'Organic skincare ritual with serum bottles',
  },
  {
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200',
    alt: 'Natural beauty products arranged on a table',
  },
  {
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=1200',
    alt: 'Fresh botanical skincare ingredients',
  },
];

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.products.list();
        setFeaturedProducts(response.products.filter((product) => product.featured).slice(0, 4));
      } catch {
        setFeaturedProducts([]);
      }
    };

    void loadProducts();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div>
      <section className="relative bg-gradient-to-br from-emerald-50 via-lime-50 to-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-700 mb-4">
                Organic skincare only
              </p>
              <h1 className="text-5xl font-serif text-emerald-950 mb-6">
                Trusted organic beauty
                <br />
                for healthy, radiant skin
              </h1>
              <p className="text-lg text-neutral-700 mb-8">
                Qamarun Beauty is a focused skincare store built around genuine plant-based
                ingredients, transparent product details, and a simple shopping experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="px-8 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
                >
                  Shop Organic Care
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-3 border-2 border-emerald-700 text-emerald-700 rounded-lg hover:bg-emerald-50 transition"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-white/50 rounded-[2rem] blur-2xl" />
              <div className="relative rounded-[2rem] shadow-2xl overflow-hidden h-[480px]">
                {heroSlides.map((slide, index) => (
                  <img
                    key={slide.image}
                    src={slide.image}
                    alt={slide.alt}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                      index === activeSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/45 to-transparent px-5 py-5">
                  <div className="flex gap-2">
                    {heroSlides.map((slide, index) => (
                      <button
                        key={slide.image}
                        type="button"
                        onClick={() => setActiveSlide(index)}
                        className={`h-2.5 w-2.5 rounded-full transition ${
                          index === activeSlide ? 'bg-white' : 'bg-white/45'
                        }`}
                        aria-label={`Show slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length)
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-emerald-900 hover:bg-white transition"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSlide((current) => (current + 1) % heroSlides.length)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-emerald-900 hover:bg-white transition"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {featureCards.map(({ title, description, Icon }) => (
              <div key={title} className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-emerald-700" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
                <p className="text-sm text-neutral-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-serif text-emerald-950 mb-3">Featured Products</h2>
              <p className="text-neutral-600">
                Explore some of the most-loved essentials in the Qamarun Beauty collection.
              </p>
            </div>
            <Link to="/products" className="text-emerald-700 hover:text-emerald-800">
              Browse all products
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-emerald-700 uppercase tracking-[0.2em] mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-medium text-neutral-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{product.description}</p>
                  <p className="text-emerald-800 font-semibold">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
