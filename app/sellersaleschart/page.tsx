"use client";

import React, { useMemo } from "react";
import { Card, CardHeader, CardContent, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface SellerOrder {
  _id: string;
  createdAt: string;
  totalAmount: number;
}

interface SellerSalesChartProps {
  orders: SellerOrder[];
}

const SellerSalesChart: React.FC<SellerSalesChartProps> = ({ orders }) => {
  // Group orders by month & sum totalAmount
  const data = useMemo(() => {
    const map = new Map<string, number>();

    orders.forEach((order) => {
      const d = new Date(order.createdAt);
      // e.g., "Jan 2025"
      const key = d.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });

      const prev = map.get(key) || 0;
      map.set(key, prev + (order.totalAmount || 0));
    });

    // Convert map to array for chart
    const result = Array.from(map.entries())
      .map(([month, total]) => ({ month, total }))
      // sort by actual date order
      .sort((a, b) => {
        const [am, ay] = a.month.split(" ");
        const [bm, by] = b.month.split(" ");
        const aa = new Date(`${am} 1, ${ay}`).getTime();
        const bb = new Date(`${bm} 1, ${by}`).getTime();
        return aa - bb;
      });

    return result;
  }, [orders]);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        bgcolor: "#ffffff",
        mt: 3,
      }}
    >
      <CardHeader
        title="Sales Overview"
        subheader="Total sales amount per month for your books."
      />
      <CardContent>
        {data.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            No sales data available yet.
          </Box>
        ) : (
          <Box sx={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SellerSalesChart;
