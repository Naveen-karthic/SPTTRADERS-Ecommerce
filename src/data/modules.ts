export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount?: number;
}

export const GROCERY_CATEGORIES: Category[] = [
  {
    id: 'dal-pulses',
    name: 'Dal & Pulses',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200',
    itemCount: 45
  },
  {
    id: 'atta-flours',
    name: 'Atta & Flour',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=200',
    itemCount: 32
  },
  {
    id: 'rice-products',
    name: 'Rice & Rice Products',
    image: 'https://images.unsplash.com/photo-1596477044049-71cbd8fa7e83?auto=format&fit=crop&q=80&w=200',
    itemCount: 56
  },
  {
    id: 'ghee-oils',
    name: 'Ghee & Oils',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbad93c5?auto=format&fit=crop&q=80&w=200',
    itemCount: 28
  },
  {
    id: 'dry-fruits',
    name: 'Dry Fruits',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d96?auto=format&fit=crop&q=80&w=200',
    itemCount: 67
  },
  {
    id: 'sugar-salt',
    name: 'Sugar & Salt',
    image: 'https://images.unsplash.com/photo-1589985664009-ecf9aeef7f19?auto=format&fit=crop&q=80&w=200',
    itemCount: 23
  },
  {
    id: 'masala-spices',
    name: 'Masala & Spices',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=200',
    itemCount: 89
  },
  {
    id: 'snacks',
    name: 'Snacks',
    image: 'https://images.unsplash.com/photo-1566478941049-3f7e6d56f714?auto=format&fit=crop&q=80&w=200',
    itemCount: 72
  },
  {
    id: 'tea',
    name: 'Tea',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=200',
    itemCount: 41
  },
  {
    id: 'coffee',
    name: 'Coffee',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=200',
    itemCount: 38
  }
];

export const FERTILIZER_CATEGORIES: Category[] = [
  {
    id: 'organic-fertilizer',
    name: 'Organic Fertilizer',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=200',
    itemCount: 35
  },
  {
    id: 'bio-fertilizer',
    name: 'Bio Fertilizer',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=200',
    itemCount: 28
  },
  {
    id: 'liquid-fertilizer',
    name: 'Liquid Fertilizer',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=200',
    itemCount: 22
  },
  {
    id: 'micronutrients',
    name: 'Micronutrients',
    image: 'https://images.unsplash.com/photo-1574983321307-05699fd62129?auto=format&fit=crop&q=80&w=200',
    itemCount: 19
  },
  {
    id: 'soil-conditioner',
    name: 'Soil Conditioner',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=200',
    itemCount: 15
  },
  {
    id: 'plant-growth-booster',
    name: 'Plant Growth Booster',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=200',
    itemCount: 31
  },
  {
    id: 'pesticides',
    name: 'Pesticides',
    image: 'https://images.unsplash.com/photo-1563286054-3f39f0fe8b3c?auto=format&fit=crop&q=80&w=200',
    itemCount: 44
  },
  {
    id: 'seeds',
    name: 'Seeds',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=200',
    itemCount: 58
  }
];

// Helper function to get categories by module type
export const getCategoriesByModule = (moduleType: string): Category[] => {
  switch (moduleType) {
    case 'grocery':
      return GROCERY_CATEGORIES;
    case 'fertilizer':
      return FERTILIZER_CATEGORIES;
    default:
      return [];
  }
};
