"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { DoctorPatientCount } from "@/lib/api/schemas/dashboard";

export function DoctorPatientChart({ data }: { data: DoctorPatientCount[] }) {
  return (
    <div aria-hidden="true" className="h-80 min-w-0 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 8, left: -12, bottom: 48 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="doctorName"
            angle={-28}
            textAnchor="end"
            interval={0}
            height={72}
            tick={{ fontSize: 12 }}
          />
          <YAxis allowDecimals={false} domain={[0, "auto"]} tick={{ fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            formatter={(value) => [Number(value).toLocaleString(), "Patients"]}
          />
          <Bar dataKey="patientCount" name="Patients" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
