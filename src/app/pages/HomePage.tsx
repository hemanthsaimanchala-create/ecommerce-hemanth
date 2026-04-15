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
    eyebrow: 'Calming ritual',
    title: 'Botanical care for a softer, clearer daily routine',
    description:
      'Discover ingredient-led cleansers, serums, and moisturizers selected for real organic skincare routines.',
    accent: 'Rosehip, aloe vera, chamomile',
    label: 'Botanical ritual',
    surfaceClass: 'bg-[linear-gradient(145deg,#eef7eb_0%,#fdf4ea_52%,#edf8f1_100%)]',
    panelClass: 'bg-[#fff8ef]/95',
    accentClass: 'bg-emerald-700/12',
    accentStrongClass: 'bg-emerald-800/22',
    bottleOneClass: 'bg-[#d7b089]',
    bottleTwoClass: 'bg-[#0f6b52]',
    leafClass: 'bg-[#7faf73]/90',
  },
  {
    eyebrow: 'Curated essentials',
    title: 'A dedicated skincare store without chemical-product confusion',
    description:
      'Every product page highlights benefits, ingredients, and simple guidance so customers can shop with confidence.',
    accent: 'Transparent labels, clean categories',
    label: 'Clean shelf',
    surfaceClass: 'bg-[linear-gradient(145deg,#fdf1e3_0%,#f7f7ef_40%,#edf7ef_100%)]',
    panelClass: 'bg-[#fffdf7]/95',
    accentClass: 'bg-amber-700/12',
    accentStrongClass: 'bg-amber-800/18',
    bottleOneClass: 'bg-[#6f9d78]',
    bottleTwoClass: 'bg-[#c88a59]',
    leafClass: 'bg-[#8cba7a]/90',
  },
  {
    eyebrow: 'Glow naturally',
    title: 'Organic formulas that feel premium, honest, and easy to trust',
    description:
      'Build a full skincare ritual from plant-based picks chosen for hydration, balance, and everyday comfort.',
    accent: 'Cruelty-free, botanical, student-friendly',
    label: 'Daily glow',
    surfaceClass: 'bg-[linear-gradient(145deg,#edf8f1_0%,#f6fbf1_45%,#fdf0e7_100%)]',
    panelClass: 'bg-[#f8fbf3]/95',
    accentClass: 'bg-emerald-700/12',
    accentStrongClass: 'bg-emerald-800/20',
    bottleOneClass: 'bg-[#d2a66f]',
    bottleTwoClass: 'bg-[#2d7867]',
    leafClass: 'bg-[#76aa70]/90',
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
              <div className="relative h-[420px] overflow-hidden rounded-[2.5rem] border border-white/70 shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:h-[500px]">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.title}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                      index === activeSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className={`absolute inset-0 ${slide.surfaceClass}`} />
                    <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-white/35 blur-2xl" />
                    <div className="absolute bottom-6 left-6 h-36 w-36 rounded-full bg-white/25 blur-3xl" />
                    <div
                      className={`absolute inset-x-[9%] top-[11%] bottom-[11%] rounded-[2.3rem] border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ${slide.panelClass}`}
                    />
                    <div className="absolute left-[17%] top-[18%] rounded-full px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">
                      <span className={`absolute inset-0 rounded-full ${slide.accentClass}`} />
                      <span className="relative">{slide.label}</span>
                    </div>
                    <div className={`absolute left-[20%] top-[34%] h-[42%] w-[22%] rounded-[2rem] shadow-xl ${slide.bottleOneClass}`} />
                    <div className="absolute left-[23%] top-[28%] h-[7%] w-[16%] rounded-[1rem] bg-white/30" />
                    <div className={`absolute left-[46%] top-[23%] h-[51%] w-[18%] rounded-[2rem] shadow-xl ${slide.bottleTwoClass}`} />
                    <div className={`absolute left-[50%] top-[18%] h-[7%] w-[10%] rounded-[0.9rem] ${slide.accentStrongClass}`} />
                    <div className={`absolute right-[13%] top-[39%] h-[31%] w-[22%] rounded-[2rem] shadow-lg ${slide.accentClass}`} />
                    <div className={`absolute right-[18%] top-[50%] h-4 w-[20%] rounded-full ${slide.accentStrongClass}`} />
                    <div className={`absolute right-[21%] top-[58%] h-4 w-[13%] rounded-full ${slide.accentClass}`} />
                    <div className={`absolute right-[13%] top-[17%] h-16 w-28 rotate-[28deg] rounded-[80%_0] ${slide.leafClass}`} />
                    <div className={`absolute right-[6%] top-[16%] h-14 w-24 rotate-[52deg] rounded-[80%_0] ${slide.leafClass}`} />
                    <div className={`absolute right-[29%] bottom-[11%] h-20 w-32 -rotate-[18deg] rounded-[80%_0] ${slide.leafClass}`} />
                  </div>
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
