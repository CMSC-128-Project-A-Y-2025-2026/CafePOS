// src/app/menu/mockData.ts

import { MenuItem } from './types';

// Exported list of fixed categories for the dropdown
export const menuCategories = [
    'signature', 
    'coffee-based', 
    'frappe-based', 
    'non-coffee', 
    'matcha-based', 
    'soda-based', 
    'waffles', 
    'pasta-sandwich', 
    'pika-pika'
];

export const initialMenuItems: MenuItem[] = [
    // Data reused from your previous products list
    { id: 1, name: 'Americano', price: 99, image: 'https://placehold.co/150x150/F9F1E9/333?text=Americano', category: 'signature' },
    { id: 2, name: 'Biscoff Latte', price: 189, image: 'https://placehold.co/150x150/F9F1E9/333?text=Biscoff+Latte', category: 'signature' },
    { id: 3, name: 'Caramel Latte', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Caramel+Latte', category: 'signature' },
    { id: 4, name: 'Latte', price: 139, image: 'https://placehold.co/150x150/F9F1E9/333?text=Latte', category: 'signature' },
    { id: 5, name: 'Kape Dulce', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=Kape+Dulce', category: 'signature' },
    { id: 6, name: 'Sea Salt Latte', price: 189, image: 'https://placehold.co/150x150/F9F1E9/333?text=Sea+Salt+Latte', category: 'signature' },
    { id: 7, name: 'Spanish Oat', price: 179, image: 'https://placehold.co/150x150/F9F1E9/333?text=Spanish+Oat', category: 'signature' },
    { id: 8, name: 'Spanish Latte', price: 149, image: 'https://placehold.co/150x150/F9F1E9/333?text=Spanish+Latte', category: 'signature' },
    { id: 9, name: 'Tiramisu', price: 189, image: 'https://placehold.co/150x150/F9F1E9/333?text=Tiramisu', category: 'signature' },
    { id: 10, name: 'White Mocha', price: 159, image: 'https://placehold.co/150x150/F9F1E9/333?text=White+Mocha', category: 'signature' },
    { id: 11, name: 'Caramel Mac', price: 49, image: 'https://placehold.co/150x150/F9F1E9/333?text=Caramel+Mac', category: 'coffee-based' },
    { id: 12, name: 'Cinnamon Latte', price: 69, image: 'https://placehold.co/150x150/F9F1E9/333?text=Cinnamon+Latte', category: 'coffee-based' },
    { id: 13, name: 'Macchiato with Ice Cream', price: 69, image: 'https://placehold.co/150x150/F9F1E9/333?text=Macchiato+Ice+Cream', category: 'coffee-based' },
    { id: 14, name: 'Mocha', price: 75, image: 'https://placehold.co/150x150/F9F1E9/333?text=Mocha', category: 'coffee-based' },
];