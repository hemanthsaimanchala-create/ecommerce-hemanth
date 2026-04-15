export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  ingredients: string[];
  benefits: string[];
  image: string;
  category: string;
  inStock: boolean;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Rose Water Toner',
    price: 24.99,
    description: 'Pure organic rose water toner to refresh and balance your skin. Handcrafted with Bulgarian rose petals.',
    ingredients: ['Organic Rose Water', 'Aloe Vera Extract', 'Vitamin E', 'Glycerin'],
    benefits: ['Hydrates skin', 'Balances pH', 'Reduces redness', 'Natural antioxidants'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
    category: 'Toners',
    inStock: true,
  },
  {
    id: '2',
    name: 'Green Tea Facial Cleanser',
    price: 29.99,
    description: 'Gentle organic cleanser infused with green tea and chamomile. Perfect for all skin types.',
    ingredients: ['Green Tea Extract', 'Chamomile Oil', 'Jojoba Oil', 'Coconut Oil'],
    benefits: ['Deep cleansing', 'Anti-aging properties', 'Soothes skin', 'Removes impurities'],
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500',
    category: 'Cleansers',
    inStock: true,
  },
  {
    id: '3',
    name: 'Lavender Night Cream',
    price: 39.99,
    description: 'Luxurious night cream with organic lavender and shea butter. Wake up to radiant skin.',
    ingredients: ['Lavender Essential Oil', 'Shea Butter', 'Argan Oil', 'Vitamin C'],
    benefits: ['Deep moisturization', 'Promotes relaxation', 'Repairs skin overnight', 'Anti-aging'],
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500',
    category: 'Moisturizers',
    inStock: true,
  },
  {
    id: '4',
    name: 'Turmeric Face Mask',
    price: 34.99,
    description: 'Brightening face mask with organic turmeric and honey. Reveals glowing, even-toned skin.',
    ingredients: ['Organic Turmeric', 'Raw Honey', 'Yogurt', 'Lemon Extract'],
    benefits: ['Brightens complexion', 'Reduces dark spots', 'Anti-inflammatory', 'Natural glow'],
    image: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=500',
    category: 'Masks',
    inStock: true,
  },
  {
    id: '5',
    name: 'Vitamin C Serum',
    price: 44.99,
    description: 'Powerful organic vitamin C serum with rosehip oil. Fights signs of aging and brightens skin.',
    ingredients: ['Vitamin C', 'Rosehip Oil', 'Hyaluronic Acid', 'Ferulic Acid'],
    benefits: ['Brightens skin tone', 'Reduces fine lines', 'Boosts collagen', 'Protects from damage'],
    image: 'https://images.unsplash.com/photo-1620916297991-f49084d0e723?w=500',
    category: 'Serums',
    inStock: true,
  },
  {
    id: '6',
    name: 'Aloe Vera Gel',
    price: 19.99,
    description: 'Pure organic aloe vera gel. Soothes, hydrates, and heals your skin naturally.',
    ingredients: ['100% Pure Aloe Vera', 'Vitamin E', 'Green Tea Extract'],
    benefits: ['Intense hydration', 'Soothes sunburn', 'Heals acne', 'Multi-purpose'],
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500',
    category: 'Treatments',
    inStock: true,
  },
  {
    id: '7',
    name: 'Coffee Body Scrub',
    price: 27.99,
    description: 'Exfoliating body scrub with organic coffee grounds and coconut oil. Smooths and energizes skin.',
    ingredients: ['Organic Coffee Grounds', 'Coconut Oil', 'Brown Sugar', 'Vanilla Extract'],
    benefits: ['Exfoliates dead skin', 'Reduces cellulite', 'Improves circulation', 'Moisturizes'],
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500',
    category: 'Body Care',
    inStock: true,
  },
  {
    id: '8',
    name: 'Argan Oil Hair Serum',
    price: 32.99,
    description: 'Premium organic argan oil for lustrous, healthy hair. Nourishes and protects from damage.',
    ingredients: ['100% Pure Argan Oil', 'Vitamin E', 'Omega Fatty Acids'],
    benefits: ['Repairs damaged hair', 'Adds shine', 'Reduces frizz', 'Strengthens hair'],
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500',
    category: 'Hair Care',
    inStock: true,
  },
];
