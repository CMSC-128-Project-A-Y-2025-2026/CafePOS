// Existing menu categories 
export const menuCategories = [
  "signature",
  "coffee-based",
  "frappe-based",
  "non-coffee",
  "matcha-based",
  "soda-based",
  "waffles",
  "pasta-sandwich",
  "pika-pika",
];

// New structure for Inventory Management
export const inventoryCategories = [
  {
    label: '1. Beverages & Mix-Ins',
    value: 'beverages-mixins',
    subcategories: [
      { label: 'Coffee Beans & Espresso', value: 'coffee-espresso' },
      { label: 'Milk & Dairy Alternatives', value: 'milk-dairy' },
      { label: 'Syrups & Sauces', value: 'syrups-sauces' },
      { label: 'Matcha & Tea Bases', value: 'matcha-tea' },
      { label: 'Non-Coffee Liquid Bases', value: 'non-coffee-liquids' },
      { label: 'Miscellaneous Drink Bases', value: 'misc-drink-bases' },
    ]
  },
  {
    label: '2. Frappe & Add-Ons',
    value: 'frappe-addons',
    subcategories: [
      { label: 'Flavor Powders/Mixes', value: 'flavor-powders' },
      { label: 'Solid Add-Ons & Toppings', value: 'solid-toppings' },
      { label: 'Popping & Jelly', value: 'popping-jelly' },
      { label: 'Espresso Shots (Add-On)', value: 'espresso-addon' },
    ]
  },
  {
    label: '3. Food Items & Snacks',
    value: 'food-snacks',
    subcategories: [
      { label: 'Waffle/Bread Ingredients', value: 'waffle-bread' },
      { label: 'Savory Fillings & Meats', value: 'savory-fillings' },
      { label: 'Pasta & Sauces', value: 'pasta-sauces' },
      { label: 'Pika-Pika Components', value: 'pika-pika-components' },
      { label: 'Food Toppings & Sweets', value: 'food-toppings' },
    ]
  },
  {
    label: '4. Non-Food & Operational Supplies',
    value: 'operational-supplies',
    subcategories: [
      { label: 'Paper Goods', value: 'paper-goods' },
      { label: 'Utensils & Straws', value: 'utensils-straws' },
      { label: 'Cleaning & Kitchen Supplies', value: 'cleaning-kitchen' },
    ]
  }
];

export type InventoryItem = {
  id: string;
  product: string;
  category: string; 
  stock: number;
  status: 'in stock' | 'low stock' | 'out of stock';
  cost: string;
};