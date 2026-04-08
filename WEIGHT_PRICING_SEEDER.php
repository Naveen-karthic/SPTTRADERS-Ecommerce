<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\WeightPrice;
use Illuminate\Database\Seeder;

/**
 * Weight-Based Product Seeder
 *
 * Run: php artisan db:seed --class=WeightBasedProductSeeder
 */
class WeightBasedProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create category first (if not exists)
        $seedsCategory = \App\Models\Category::firstOrCreate(
            ['name' => 'Seeds'],
            [
                'description' => 'All types of seeds for gardening',
                'image' => 'categories/seeds.jpg'
            ]
        );

        $products = [
            [
                'name' => 'Organic Tomato Seeds',
                'item_code' => 'SEED-TOM-001',
                'description' => 'High-yield hybrid tomato seeds perfect for home gardening',
                'pricing_type' => 'weight',
                'base_price' => 100,
                'image' => 'products/tomato-seeds.jpg',
                'category_id' => $seedsCategory->id,
                'is_active' => true,
                'weight_prices' => [
                    [
                        'weight' => '1kg',
                        'price' => 100,
                        'original_price' => null,
                        'is_best_value' => false,
                        'sort_order' => 0
                    ],
                    [
                        'weight' => '2kg',
                        'price' => 180,
                        'original_price' => 200,
                        'is_best_value' => false,
                        'sort_order' => 1
                    ],
                    [
                        'weight' => '3kg',
                        'price' => 250,
                        'original_price' => 300,
                        'is_best_value' => true,
                        'sort_order' => 2
                    ]
                ]
            ],
            [
                'name' => 'Hybrid Pumpkin Seeds',
                'item_code' => 'SEED-PUM-001',
                'description' => 'Premium pumpkin seeds for growing large, sweet pumpkins',
                'pricing_type' => 'weight',
                'base_price' => 150,
                'image' => 'products/pumpkin-seeds.jpg',
                'category_id' => $seedsCategory->id,
                'is_active' => true,
                'weight_prices' => [
                    [
                        'weight' => '500g',
                        'price' => 80,
                        'original_price' => null,
                        'is_best_value' => false,
                        'sort_order' => 0
                    ],
                    [
                        'weight' => '1kg',
                        'price' => 150,
                        'original_price' => null,
                        'is_best_value' => false,
                        'sort_order' => 1
                    ],
                    [
                        'weight' => '2kg',
                        'price' => 270,
                        'original_price' => 300,
                        'is_best_value' => true,
                        'sort_order' => 2
                    ]
                ]
            ],
            [
                'name' => 'Sunflower Seeds',
                'item_code' => 'SEED-SUN-001',
                'description' => 'Giant sunflower seeds - grows up to 12 feet tall',
                'pricing_type' => 'weight',
                'base_price' => 80,
                'image' => 'products/sunflower-seeds.jpg',
                'category_id' => $seedsCategory->id,
                'is_active' => true,
                'weight_prices' => [
                    [
                        'weight' => '500g',
                        'price' => 50,
                        'original_price' => null,
                        'is_best_value' => false,
                        'sort_order' => 0
                    ],
                    [
                        'weight' => '1kg',
                        'price' => 80,
                        'original_price' => null,
                        'is_best_value' => false,
                        'sort_order' => 1
                    ],
                    [
                        'weight' => '2kg',
                        'price' => 140,
                        'original_price' => 160,
                        'is_best_value' => true,
                        'sort_order' => 2
                    ]
                ]
            ],
            [
                'name' => 'Organic Carrot Seeds',
                'item_code' => 'SEED-CAR-001',
                'description' => 'Sweet and crunchy carrot seeds - grows in 70 days',
                'pricing_type' => 'weight',
                'base_price' => 120,
                'discount' => 5,
                'image' => 'products/carrot-seeds.jpg',
                'category_id' => $seedsCategory->id,
                'is_active' => true,
                'weight_prices' => [
                    [
                        'weight' => '1kg',
                        'price' => 120,
                        'original_price' => null,
                        'is_best_value' => false,
                        'sort_order' => 0
                    ],
                    [
                        'weight' => '2kg',
                        'price' => 220,
                        'original_price' => 240,
                        'is_best_value' => false,
                        'sort_order' => 1
                    ],
                    [
                        'weight' => '3kg',
                        'price' => 300,
                        'original_price' => 360,
                        'is_best_value' => true,
                        'sort_order' => 2
                    ]
                ]
            ],
            [
                'name' => 'Mixed Vegetable Seeds Pack',
                'item_code' => 'SEED-MIX-001',
                'description' => 'Assorted vegetable seeds for beginners',
                'pricing_type' => 'weight',
                'base_price' => 200,
                'image' => 'products/mixed-seeds.jpg',
                'category_id' => $seedsCategory->id,
                'is_active' => true,
                'weight_prices' => [
                    [
                        'weight' => '1kg',
                        'price' => 200,
                        'original_price' => null,
                        'is_best_value' => false,
                        'sort_order' => 0
                    ],
                    [
                        'weight' => '2kg',
                        'price' => 360,
                        'original_price' => 400,
                        'is_best_value' => false,
                        'sort_order' => 1
                    ],
                    [
                        'weight' => '5kg',
                        'price' => 800,
                        'original_price' => 1000,
                        'is_best_value' => true,
                        'sort_order' => 2
                    ]
                ]
            ]
        ];

        foreach ($products as $productData) {
            // Extract weight prices
            $weightPrices = $productData['weight_prices'];
            unset($productData['weight_prices']);

            // Create product
            $product = Product::create($productData);

            // Create weight prices
            foreach ($weightPrices as $weightPrice) {
                WeightPrice::create([
                    'product_id' => $product->id,
                    'weight' => $weightPrice['weight'],
                    'price' => $weightPrice['price'],
                    'original_price' => $weightPrice['original_price'],
                    'is_best_value' => $weightPrice['is_best_value'],
                    'sort_order' => $weightPrice['sort_order'],
                ]);
            }

            $this->command->info("✅ Created product: {$product->name} with weight pricing");
        }

        $this->command->info('✅ All weight-based products created successfully!');
    }
}
