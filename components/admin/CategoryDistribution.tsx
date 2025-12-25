"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useLanguage } from "@/contexts/LanguageContext"

const COLORS = ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444"]

export function CategoryDistribution() {
  const { language, t } = useLanguage()

  const data = [
    { name: language === "ar" ? "عباءات" : "Abayas", value: 400 },
    { name: language === "ar" ? "حجاب" : "Hijabs", value: 300 },
    { name: language === "ar" ? "فساتين" : "Dresses", value: 200 },
    { name: language === "ar" ? "إكسسوارات" : "Accessories", value: 100 },
  ]

  return (
    <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-foreground dark:text-white">
          {language === "ar" ? "توزيع المنتجات" : "Product Distribution"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => (percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : name)}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
