export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount?: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'dal-pulses',
    name: 'Dal & Pulses',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200',
    itemCount: 45
  },
  {
    id: 'atta-flours',
    name: 'Atta & Flours',
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
    id: 'biscuits-cookies',
    name: 'Biscuits & Cookies',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=200',
    itemCount: 54
  },
  {
    id: 'chips-namkeen',
    name: 'Chips & Namkeen',
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
  },
  {
    id: 'breakfast',
    name: 'Breakfast Essentials',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=200',
    itemCount: 29
  }
];
