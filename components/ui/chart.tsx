"use client"
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Line,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"

interface ChartProps {
  data: any[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  yAxisWidth?: number
}

export function BarChart({ data, index, categories, colors, valueFormatter, yAxisWidth }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis tickFormatter={valueFormatter} width={yAxisWidth} />
        <Tooltip formatter={(value) => (valueFormatter ? [valueFormatter(value)] : [value])} />
        <Legend />
        {categories.map((category, i) => (
          <Bar key={category} dataKey={category} fill={colors[i % colors.length]} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export function LineChart({ data, index, categories, colors, valueFormatter, yAxisWidth }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={index} />
        <YAxis tickFormatter={valueFormatter} width={yAxisWidth} />
        <Tooltip formatter={(value) => (valueFormatter ? [valueFormatter(value)] : [value])} />
        <Legend />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export function PieChart({ data, index, categories, colors, valueFormatter }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie dataKey="value" data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
          {data.map((entry, i) => (
            <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => (valueFormatter ? [valueFormatter(value)] : [value])} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

