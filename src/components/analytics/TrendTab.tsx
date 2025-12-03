"use client";

import React, { useEffect } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { TimeFilterButton } from "../ui/HelperComponents";

interface SalesData {
  date?: string;
  hour?: string;
  sales: number;
}

export default function TrendTab() {
  const [filter, setFilter] = React.useState<"hour" | "day">("day");
  const [salesAnalytics, setSalesAnalytics] = React.useState<SalesData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [chartTitle, setChartTitle] = React.useState<string>("");

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

    const formatData = async () => {
      setLoading(true);
      switch (filter) {
        case "hour":
          formattedData = hourlyDataFormatter(salesAnalytics);
          setChartTitle("Hourly Trend");
          break;
        case "day":
          formattedData = weeklyDataFormatter(salesAnalytics);
          setChartTitle("Daily Trend");
          break;
        default:
          formattedData = hourlyDataFormatter(salesAnalytics);
          break;
      }
      setChartData(formattedData);
      setLoading(false);
    };
    formatData();
  }, [filter, salesAnalytics]);

  const brandColor = "#6290C3";

  return (
    <div className="flex h-full flex-col gap-3 pt-2">
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
      <div className="flex-1 bg-gray-50 p-3 rounded-xl shadow-inner border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, bottom: 0, left: 30 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e0e0e0"
              />
              <XAxis
                dataKey={filter === "hour" ? "hour" : "date"}
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
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
