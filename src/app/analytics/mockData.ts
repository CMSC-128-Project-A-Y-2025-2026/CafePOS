// src/app/analytics/mockData.ts

import { SalesItem, TopSellerProduct } from './types';

export const salesByHourData: SalesItem[] = [
  { hour: '11 AM', sales: 720 }, { hour: '12 PM', sales: 1942 }, { hour: '1 PM', sales: 971 },
  { hour: '2 PM', sales: 486 }, { hour: '3 PM', sales: 450 }, { hour: '4 PM', sales: 1200 },
  { hour: '5 PM', sales: 1800 }, { hour: '6 PM', sales: 1500 },
];

export const salesByDayData: SalesItem[] = [
  { day: 'Sun', sales: 1300, color: '#FFB6C1' }, { day: 'Mon', sales: 1200, color: '#D2B48C' },
  { day: 'Tue', sales: 1800, color: '#98FB98' }, { day: 'Wed', sales: 2100, color: '#20B2AA' },
  { day: 'Thu', sales: 1300, color: '#ADD8E6' }, { day: 'Fri', sales: 1250, color: '#DDA0DD' },
  { day: 'Sat', sales: 3000, color: '#F08080' },
];

export const allTopBestsellers: TopSellerProduct[] = [
  // Signature
  { id: 1, productName: 'Americano', price: 99, category: 'signature', itemsSold: 120 },
  { id: 2, productName: 'Spanish Latte', price: 149, category: 'signature', itemsSold: 180 },
  { id: 3, productName: 'Biscoff Latte', price: 189, category: 'signature', itemsSold: 95 },
  // Coffee Based
  { id: 4, productName: 'Caramel Mac', price: 49, category: 'coffee-based', itemsSold: 150 },
  { id: 5, productName: 'Vanilla Latte', price: 65, category: 'coffee-based', itemsSold: 110 },
  { id: 6, productName: 'Salted Caramel', price: 65, category: 'coffee-based', itemsSold: 88 },
  // Frappe Based
  { id: 7, productName: 'Cookies N Cream', price: 159, category: 'frappe-based', itemsSold: 75 },
  { id: 8, productName: 'Biscoff Frappe', price: 159, category: 'frappe-based', itemsSold: 62 },
  { id: 9, productName: 'Java Chips', price: 159, category: 'frappe-based', itemsSold: 45 },
  // Non-Coffee
  { id: 10, productName: 'Cocoa Cloud', price: 89, category: 'non-coffee', itemsSold: 55 },
  { id: 11, productName: 'Iced Cocoa', price: 69, category: 'non-coffee', itemsSold: 70 },
  { id: 12, productName: 'Milky Strawberry', price: 65, category: 'non-coffee', itemsSold: 35 },
  // Matcha Based
  { id: 13, productName: 'Matcha', price: 79, category: 'matcha-based', itemsSold: 40 },
  { id: 14, productName: 'Sea Salt Matcha', price: 119, category: 'matcha-based', itemsSold: 30 },
  // Soda Based
  { id: 15, productName: 'Yakult Berry', price: 90, category: 'soda-based', itemsSold: 58 },
  { id: 16, productName: 'Green Apple with Yakult', price: 85, category: 'soda-based', itemsSold: 48 },
  // Waffles
  { id: 17, productName: 'Classic Waffles', price: 65, category: 'waffles', itemsSold: 135 },
  { id: 18, productName: 'Chocolate Waffles', price: 69, category: 'waffles', itemsSold: 72 },
  // Pasta & Sandwich
  { id: 19, productName: 'Carbonara', price: 149, category: 'pasta-sandwich', itemsSold: 68 },
  { id: 20, productName: 'Hotdog Clubhouse', price: 109, category: 'pasta-sandwich', itemsSold: 50 },
  // Pika-Pika
  { id: 21, productName: 'Fries', price: 55, category: 'pika-pika', itemsSold: 145 },
  { id: 22, productName: 'Beef Nachos', price: 159, category: 'pika-pika', itemsSold: 90 },
  { id: 23, productName: 'Pres Kopee Mix', price: 99, category: 'pika-pika', itemsSold: 85 },
];

export const bestsellerCategories = [
    { id: 'all', label: 'All' },
    { id: 'signature', label: 'Signature' },
    { id: 'coffee-based', label: 'Coffee Based' },
    { id: 'frappe-based', label: 'Frappe Based' },
    { id: 'non-coffee', label: 'Non-Coffee' },
    { id: 'matcha-based', label: 'Matcha Based' },
    { id: 'soda-based', label: 'Soda Based' },
    { id: 'waffles', label: 'Waffles' },
    { id: 'pasta-sandwich', label: 'Pasta & Sandwich' },
    { id: 'pika-pika', label: 'Pika-Pika' },
];