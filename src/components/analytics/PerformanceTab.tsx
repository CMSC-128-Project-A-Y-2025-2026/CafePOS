// src/components/analytics/PerformanceTab.tsx
"use client";

import React, { useEffect } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { StatCard } from "../ui/HelperComponents"; // Assuming HelperComponents.tsx is correct
interface PerformanceTabProps {
  activeTimeFilter: string;
}

interface SalesData {
  date?: string;
  hour?: string;
  sales: number;
}

export default function PerformanceTab({
  activeTimeFilter,
}: PerformanceTabProps) {
  const brandColor = "#6290C3";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [salesAnalytics, setSalesAnalytics] = React.useState<SalesData[]>([]);
  const [totalRevenue, setTotalRevenue] = React.useState<number>(0);
  const [salesCount, setSalesCount] = React.useState<number>(0);
  const [averageSale, setAverageSale] = React.useState<number>(0);
  const [estimatedProfit, setEstimatedProfit] = React.useState<number>(0);

  const getSalesData = async () => {
    try {
      const response = await fetch("/api/analytics/getSalesAnalytics");
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to fetch analytics");
      return data;
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  };

  useEffect(() => {
    async function loadData() {
      const cached = localStorage.getItem("sales-analytics");
      if (cached) setSalesAnalytics(JSON.parse(cached));
      const fresh = await getSalesData();
      if (!fresh) return;
      if (JSON.stringify(fresh) !== JSON.stringify(cached)) {
        localStorage.setItem("sales-analytics", JSON.stringify(fresh));
        setSalesAnalytics(fresh);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    let formattedData: SalesData[] = [];

    function hourlyDataFormatter(data: SalesData[]) {
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
      const hourlySales: { [key: string]: number } = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.forEach((sale: any) => {
        const saleDate = new Date(sale.created_at);
        if (saleDate >= twentyFourHoursAgo) {
          const hourKey = saleDate.toISOString().slice(0, 13);
          hourlySales[hourKey] =
            (hourlySales[hourKey] || 0) + (sale.order_price || 0);
        }
      });
      const formattedData = [];
      for (let i = 23; i >= 0; i--) {
        const date = new Date();
        date.setHours(date.getHours() - i);
        date.setMinutes(0, 0, 0);
        const hourKey = date.toISOString().slice(0, 13);
        formattedData.push({
          hour: hourKey,
          sales: hourlySales[hourKey] || 0,
        });
      }
      return formattedData;
    }

    function weeklyDataFormatter(data: SalesData[]) {
      const weekly = new Date();
      weekly.setDate(weekly.getDate() - 7);
      const dailySales: { [key: string]: number } = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.forEach((sale: any) => {
        const saleDate = new Date(sale.created_at).toISOString().split("T")[0];
        if (new Date(saleDate) >= weekly) {
          dailySales[saleDate] =
            (dailySales[saleDate] || 0) + (sale.order_price || 0);
        }
      });

      const formattedData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        formattedData.push({
          date: dateStr,
          sales: dailySales[dateStr] || 0,
        });
      }
      return formattedData;
    }

    function monthlyDataFormatter(data: SalesData[]) {
      const monthly = new Date();
      monthly.setDate(monthly.getDate() - 30);
      const dailySales: { [key: string]: number } = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.forEach((sale: any) => {
        const saleDate = new Date(sale.created_at).toISOString().split("T")[0];
        if (new Date(saleDate) >= monthly) {
          dailySales[saleDate] =
            (dailySales[saleDate] || 0) + (sale.order_price || 0);
        }
      });

      const formattedData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        formattedData.push({
          date: dateStr,
          sales: dailySales[dateStr] || 0,
        });
      }
      return formattedData;
    }

    const formatData = async () => {
      setLoading(true);
      switch (activeTimeFilter) {
        case "today":
          formattedData = hourlyDataFormatter(salesAnalytics);
          break;
        case "week":
          formattedData = weeklyDataFormatter(salesAnalytics);
          break;
        case "month":
          formattedData = monthlyDataFormatter(salesAnalytics);
          break;
        default:
          formattedData = weeklyDataFormatter(salesAnalytics);
          break;
      }

      setChartData(formattedData);
      setLoading(false);
    };

    formatData();
  }, [activeTimeFilter, salesAnalytics]);

  useEffect(() => {
    let total = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    salesAnalytics.forEach((sale: any) => {
      total += sale.order_price || 0;
    });
    setTotalRevenue(total);
    setSalesCount(salesAnalytics.length);

    setAverageSale(salesAnalytics.length ? total / salesAnalytics.length : 0);
    setEstimatedProfit(total * 0.3);
  }, [salesAnalytics]);

  return (
    // Outer container takes full height of the parent tab content area
    <div className="flex h-full gap-4">
      {/* Stats Column: Use h-full and justify-between to distribute content vertically */}
      <div className="flex w-64 h-600 flex-col justify-between gap-2 pt-2 h-full">
        <StatCard
          label="Total Revenue"
          value={`PHP ${totalRevenue.toFixed(2)}`}
          color="green"
        />
        <StatCard
          label="Estimated Gross Profit (30% Profit Margin)"
          value={`PHP ${estimatedProfit.toFixed(2)}`}
          color="teal"
        />
        <StatCard label="Transactions" value={`${salesCount}`} color="blue" />
        <StatCard
          label="Average Sale"
          value={`PHP ${averageSale.toFixed(2)}`}
          color="dark"
        />
      </div>

      {/* Chart: Uses flex-1 to take remaining horizontal space and h-full for vertical stretch */}
      <div className="flex-1 bg-gray-50 p-3 rounded-xl shadow-inner border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 10, bottom: 0, left: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e0e0e0"
              />
              <XAxis
                dataKey={activeTimeFilter === "today" ? "hour" : "date"}
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
                isAnimationActive={true}
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
