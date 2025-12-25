"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useLanguage } from "@/contexts/LanguageContext"

export function SalesChart() {
  const { language } = useLanguage()

  const data = [
    {
      name: language === "ar" ? "يناير" : "January",
      sales: 4000,
      orders: 240,
    },
    {
      name: language === "ar" ? "فبراير" : "February",
      sales: 3000,
      orders: 198,
    },
    {
      name: language === "ar" ? "مارس" : "March",
      sales: 2000,
      orders: 180,
    },
    {
      name: language === "ar" ? "أبريل" : "April",
      sales: 2780,
      orders: 208,
    },
    {
      name: language === "ar" ? "مايو" : "May",
      sales: 1890,
      orders: 181,
    },
    {
      name: language === "ar" ? "يونيو" : "June",
      sales: 2390,
      orders: 250,
    },
    {
      name: language === "ar" ? "يوليو" : "July",
      sales: 3490,
      orders: 210,
    },
  ]

  return (
    <Card className="bg-card dark:bg-gray-800 border-border dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-foreground dark:text-white">
          {language === "ar" ? "المبيعات الشهرية" : "Monthly Sales"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "14px",
              }}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8B5CF6"
              strokeWidth={2}
              name={language === "ar" ? "المبيعات (جنيه)" : "Sales (EGP)"}
              dot={{ fill: "#8B5CF6", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#10B981"
              strokeWidth={2}
              name={language === "ar" ? "الطلبات" : "Orders"}
              dot={{ fill: "#10B981", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
