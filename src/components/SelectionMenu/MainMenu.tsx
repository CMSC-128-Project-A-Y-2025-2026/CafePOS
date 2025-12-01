// src/app/components/SelectionMenu/MainMenu.tsx

"use client";
import React from 'react';
import ChoiceCard from './ChoiceCard';
import { ClipboardPen, PieChart, Boxes, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MainMenu() {
    const router = useRouter();

    return (
        <main className="flex flex-1 items-center justify-center p-8">
            <div className="grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-4"> 
                <ChoiceCard icon={ClipboardPen} label="Order" onClick={() => router.push('/order')} />
                <ChoiceCard icon={PieChart} label="Analytics" onClick={() => router.push('/analytics')} />
                <ChoiceCard icon={Boxes} label="Inventory" onClick={() => router.push('/inventory')} />
                
                {/* NEW MENU CARD */}
                <ChoiceCard 
                    icon={Menu} 
                    label="Menu" 
                    onClick={() => router.push('/menu')} 
                />
            </div>
        </main>
    );
}