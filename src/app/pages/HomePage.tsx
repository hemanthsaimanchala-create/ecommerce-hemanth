import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Leaf,
  Shield,
  Sparkles,
  Star,
} from 'lucide-react';
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
    eyebrow: 'Calming ritual',
    title: 'Botanical care for a softer, clearer daily routine',
    description:
      'Discover ingredient-led cleansers, serums, and moisturizers selected for real organic skincare routines.',
    accent: 'Rosehip, aloe vera, chamomile',
  },
  {
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200',
    alt: 'Natural beauty products arranged on a table',
    eyebrow: 'Curated essentials',
    title: 'A dedicated skincare store without chemical-product confusion',
    description:
      'Every product page highlights benefits, ingredients, and simple guidance so customers can shop with confidence.',
    accent: 'Transparent labels, clean categories',
  },
  {
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=1200',
    alt: 'Fresh botanical skincare ingredients',
    eyebrow: 'Glow naturally',
    title: 'Organic formulas that feel premium, honest, and easy to trust',
    description:
      'Build a full skincare ritual from plant-based picks chosen for hydration, balance, and everyday comfort.',
    accent: 'Cruelty-free, botanical, student-friendly',
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
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_32%),linear-gradient(135deg,_#f7fbf2_0%,_#f2ece3_45%,_#eef7f1_100%)] py-16 sm:py-20">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute left-[-6rem] top-10 h-56 w-56 rounded-full bg-emerald-200 blur-3xl" />
          <div className="absolute bottom-0 right-[-4rem] h-72 w-72 rounded-full bg-lime-100 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/75 px-4 py-2 text-sm text-emerald-900 shadow-sm backdrop-blur">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                Trusted organic skincare only
              </div>
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-emerald-700">
                {heroSlides[activeSlide].eyebrow}
              </p>
              <h1 className="max-w-xl text-4xl font-serif leading-tight text-emerald-950 sm:text-5xl lg:text-6xl">
                {heroSlides[activeSlide].title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-700">
                {heroSlides[activeSlide].description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-7 py-3 text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-800"
                >
                  Shop Organic Care
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/register"
                  className="rounded-full border border-emerald-700 bg-white/80 px-7 py-3 text-emerald-800 transition hover:bg-emerald-50"
                >
                  Create Account
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/70 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Focus</p>
                  <p className="mt-2 font-medium text-neutral-900">Ingredient clarity</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/70 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Promise</p>
                  <p className="mt-2 font-medium text-neutral-900">100% skincare catalog</p>
                </div>
                <div className="rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-white/70 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Highlight</p>
                  <p className="mt-2 font-medium text-neutral-900">{heroSlides[activeSlide].accent}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-white/55 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
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
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/50 via-transparent to-transparent" />
                <div className="absolute left-6 top-6 max-w-xs rounded-2xl bg-white/85 p-4 shadow-lg backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-700">This week&apos;s mood</p>
                  <p className="mt-2 text-lg font-semibold text-neutral-900">
                    {heroSlides[activeSlide].eyebrow}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">{heroSlides[activeSlide].accent}</p>
                </div>
                <div className="absolute bottom-24 right-6 rounded-2xl bg-neutral-950/75 px-4 py-3 text-white backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-200">Best for</p>
                  <p className="mt-1 text-sm font-medium">Hydration, barrier care, and daily glow</p>
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/45 to-transparent px-5 py-5">
                  <div className="flex items-center gap-3">
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
                    <span className="text-sm text-white/85">
                      {String(activeSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
                    </span>
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
