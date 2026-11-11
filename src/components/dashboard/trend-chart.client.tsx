"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { type CombinedTrendPoint, formatTrendDate } from "@/components/dashboard/trend-chart.core";

export function TrendChart({ data }: { data: CombinedTrendPoint[] }) {
  return (
    <div aria-hidden="true" className="h-80 min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: -12, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickFormatter={formatTrendDate} tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip labelFormatter={(date) => formatTrendDate(String(date))} />
          <Legend />
          <Line
            type="monotone"
            dataKey="doctors"
            name="Doctors"
            stroke="var(--chart-1)"
            strokeWidth={2}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="patients"
            name="Patients"
            stroke="var(--chart-3)"
            strokeWidth={2}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
