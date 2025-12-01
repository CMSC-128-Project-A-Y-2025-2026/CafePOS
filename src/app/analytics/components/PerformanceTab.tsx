// src/app/analytics/components/PerformanceTab.tsx
import React from 'react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { salesByDayData } from '../mockData';
import { StatCard } from './HelperComponents';

export default function PerformanceTab() {
  const brandColor = '#6290C3'; 

  return (
    <div className="flex h-full gap-4" style={{ maxHeight: '380px' }}> 
      {/* Stats (w-64, aggressive vertical gap-2) */}
      <div className="flex w-64 flex-col gap-2 pt-2"> 
        {/* Title removed */}
        <StatCard label="Total Revenue" value={`PHP 15,450.00`} color="green" />
        <StatCard label="Gross Profit" value={`PHP 5,430.00`} color="teal" />
        <StatCard label="Transactions" value="234" color="blue" />
        <StatCard label="Average Sale" value={`PHP 450.00`} color="dark" />
      </div>
      
      {/* Chart: FINAL COMPACT HEIGHT h-[410px] */}
      <div className="flex-1 h-[410px] bg-gray-50 p-3 rounded-xl shadow-inner border border-gray-200" >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesByDayData} margin={{ top: 20, right: 30, bottom: 0, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis 
              dataKey="day" 
              stroke="#333" 
              tickLine={false} 
              axisLine={false} 
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => `PHP ${value}`} 
              stroke="#333" 
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid #ccc', 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                background: '#fff',
                fontSize: 12
              }}
              formatter={(value: number) => [`PHP ${value.toFixed(2)}`, 'Sales Revenue']}
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke={brandColor} 
              strokeWidth={3} 
              dot={{ fill: brandColor, r: 4 }} 
              activeDot={{ r: 6, fill: brandColor, stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}