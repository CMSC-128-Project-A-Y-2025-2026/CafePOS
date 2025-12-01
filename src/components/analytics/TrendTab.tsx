// src/app/analytics/components/TrendTab.tsx
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { salesByHourData, salesByDayData } from "../../app/analytics/mockData";
import { TimeFilterButton } from "./HelperComponents";

export default function TrendTab() {
  const [filter, setFilter] = useState<"hour" | "day">("hour");

  const data = filter === "hour" ? salesByHourData : salesByDayData;
  const dataKey = filter === "hour" ? "hour" : "day";
  const chartTitle =
    filter === "hour" ? "Sales by Hour of Day" : "Sales by Day of Week";

  const brandColor = "#6290C3";

  // gap-3 remains
  return (
    <div className="flex h-full flex-col gap-3 pt-2">
      {/* Title removed */}
      {/* <h2 className="text-xl font-bold text-gray-900 mb-2">TREND ANALYSIS</h2> */}

      <div className="flex items-center justify-between mb-1 shrink-0">
        <h3 className="text-lg font-bold text-gray-800">{chartTitle}</h3>
        <div className="flex gap-1 rounded-full bg-gray-100 p-1">
          <TimeFilterButton
            label="Hourly Sales"
            active={filter === "hour"}
            onClick={() => setFilter("hour")}
          />
          <TimeFilterButton
            label="Daily Sales"
            active={filter === "day"}
            onClick={() => setFilter("day")}
          />
        </div>
      </div>

      {/* Chart container: FINAL COMPACT HEIGHT h-[370px] */}
      <div
        className="h-[370px] bg-gray-50 p-3 rounded-xl shadow-inner border border-gray-200"
        style={{ maxHeight: "380px" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, bottom: 0, left: 30 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e0e0e0"
            />
            <XAxis
              dataKey={dataKey}
              stroke="#333"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tickFormatter={(value) => `PHP ${value}`}
              stroke="#333"
              tickLine={false}
              axisLine={false}
              fontSize={12}
            />
            <Tooltip
              cursor={{ fill: brandColor, opacity: 0.1 }}
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

            <Bar
              dataKey="sales"
              fill={brandColor}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
