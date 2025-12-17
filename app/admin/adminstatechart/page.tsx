"use client";

import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/redux/store";
import { Box, Card, CardHeader, CardContent } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const AdminStatsChart: React.FC = () => {
  const { stats } = useSelector((state: RootState) => state.admin);

  const data = [
    { name: "Customers", value: stats.customersCount },
    { name: "Sellers", value: stats.sellersCount },
    { name: "Books", value: stats.booksCount },
    { name: "Orders", value: stats.ordersCount },
  ];

  const colors = ["#4F46E5", "#22C55E", "#06B6D4", "#F97316"]; 
  
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
        title="Graphical Overview"
        subheader="Quick view of total customers, sellers, books and orders."
      />

      <CardContent>
        <Box sx={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />

              <Bar dataKey="value">
                {data.map((_, index) => (
                  <Cell key={index} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdminStatsChart;
