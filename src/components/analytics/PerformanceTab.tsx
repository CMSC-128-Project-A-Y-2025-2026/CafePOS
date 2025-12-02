import React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { salesByDayData } from "../../app/analytics/mockData";
import { StatCard } from "./HelperComponents"; // Assuming HelperComponents.tsx is correct

export default function PerformanceTab() {
  const brandColor = "#6290C3";

  return (
    // Outer container takes full height of the parent tab content area
    <div className="flex h-full gap-4">
      
      {/* Stats Column: Use h-full and justify-between to distribute content vertically */}
      <div className="flex w-64 flex-col justify-between gap-2 pt-2 h-full">
        <StatCard label="Total Revenue" value={`PHP 15,450.00`} color="green" />
        <StatCard label="Gross Profit" value={`PHP 5,430.00`} color="teal" />
        <StatCard label="Transactions" value="234" color="blue" />
        <StatCard label="Average Sale" value={`PHP 450.00`} color="dark" />
      </div>

      {/* Chart: Uses flex-1 to take remaining horizontal space and h-full for vertical stretch */}
      {/* FIX: Added h-full to explicitly force the container to expand vertically. */}
      <div className="flex-1 h-full bg-gray-50 p-3 rounded-xl shadow-inner border border-gray-200">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={salesByDayData}
            margin={{ top: 20, right: 10, bottom: 0, left: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e0e0e0"
            />
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
                borderRadius: "8px",
                border: "1px solid #ccc",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                background: "#fff",
                fontSize: 12,
              }}
              formatter={(value: number) => [
                `PHP ${value.toFixed(2)}`,
                "Sales Revenue",
              ]}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke={brandColor}
              strokeWidth={3}
              dot={{ fill: brandColor, r: 4 }}
              activeDot={{
                r: 6,
                fill: brandColor,
                stroke: "#fff",
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}