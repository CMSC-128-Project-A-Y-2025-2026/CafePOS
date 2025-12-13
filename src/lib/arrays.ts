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
    label: "1. Beverages & Mix-Ins",
    value: "beverages-mixins",
    subcategories: [
      {
        label: "Coffee Beans & Espresso",
        value: "coffee-espresso",
        unit: "g",
      },
      {
        label: "Milk & Dairy Alternatives",
        value: "milk-dairy",
        unit: "ml",
      },
      {
        label: "Syrups & Sauces",
        value: "syrups-sauces",
        unit: "ml",
      },
      {
        label: "Matcha & Tea Bases",
        value: "matcha-tea",
        unit: "g",
      },
      {
        label: "Non-Coffee Liquid Bases",
        value: "non-coffee-liquids",
        unit: "ml",
      },
      {
        label: "Miscellaneous Drink Bases",
        value: "misc-drink-bases",
        unit: "g",
      },
    ],
  },
  {
    label: "2. Frappe & Add-Ons",
    value: "frappe-addons",
    subcategories: [
      {
        label: "Flavor Powders/Mixes",
        value: "flavor-powders",
        unit: "g",
      },
      {
        label: "Solid Add-Ons & Toppings",
        value: "solid-toppings",
        unit: "g",
      },
      {
        label: "Popping & Jelly",
        value: "popping-jelly",
        unit: "g",
      },
      {
        label: "Espresso Shots (Add-On)",
        value: "espresso-addon",
        unit: "ml",
      },
    ],
  },
  {
    label: "3. Food Items & Snacks",
    value: "food-snacks",
    subcategories: [
      {
        label: "Waffle/Bread Ingredients",
        value: "waffle-bread",
        unit: "pcs",
      },
      {
        label: "Savory Fillings & Meats",
        value: "savory-fillings",
        unit: "g",
      },
      {
        label: "Pasta & Sauces",
        value: "pasta-sauces",
        unit: "g",
      },
      {
        label: "Pika-Pika Components",
        value: "pika-pika-components",
        unit: "g",
      },
      {
        label: "Food Toppings & Sweets",
        value: "food-toppings",
        unit: "g",
      },
    ],
  },
  {
    label: "4. Non-Food & Operational Supplies",
    value: "operational-supplies",
    subcategories: [
      {
        label: "Paper Goods",
        value: "paper-goods",
        unit: "pcs",
      },
      {
        label: "Utensils & Straws",
        value: "utensils-straws",
        unit: "pcs",
      },
      {
        label: "Cleaning & Kitchen Supplies",
        value: "cleaning-kitchen",
        unit: "ml",
      },
    ],
  },
];

export type InventoryItem = {
  id: string;
  product: string;
  category: string;
  stock: number;
  status: "in stock" | "low stock" | "out of stock";
  cost: string;
};

export const bestsellerCategories = [
  { id: "all", label: "All" },
  { id: "signature", label: "Signature" },
  { id: "coffee-based", label: "Coffee Based" },
  { id: "frappe-based", label: "Frappe Based" },
  { id: "non-coffee", label: "Non-Coffee" },
  { id: "matcha-based", label: "Matcha Based" },
  { id: "soda-based", label: "Soda Based" },
  { id: "waffles", label: "Waffles" },
  { id: "pasta-sandwich", label: "Pasta & Sandwich" },
  { id: "pika-pika", label: "Pika-Pika" },
];
