'use client'

import { useState } from 'react'
import { Ticket, Plus, Trash2, Copy, Calendar, Percent, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function CouponsPage() {
  const { toast } = useToast()
  
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({ title: "تم النسخ!", description: `كود الكوبون ${code} منسوخ الآن.` })
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-[2rem] border border-border/50 shadow-xl">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">كوبونات الخصم</h1>
          <p className="text-muted-foreground text-sm">أدر حملات التخفيض وجذب العملاء</p>
        </div>
        <Button className="gold-gradient h-14 px-8 rounded-2xl font-black text-lg shadow-lg w-full md:w-auto hover:scale-105 transition-all">
          <Plus className="ml-2 h-6 w-6" /> إضافة كوبون
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto md:mx-0">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input placeholder="بحث عن كوبون معين..." className="h-12 pr-12 rounded-2xl bg-card border-none shadow-sm focus-visible:ring-primary" />
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3].map((coupon) => (
          <Card key={coupon} className="group overflow-hidden border-none shadow-lg rounded-[2rem] bg-card hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                {/* الجزء الأيمن (قيمة الخصم) */}
                <div className="bg-primary p-8 flex flex-col items-center justify-center text-white sm:w-40 gap-1">
                  <span className="text-4xl font-black">20%</span>
                  <span className="text-xs font-bold uppercase tracking-tighter">خصم</span>
                  <div className="mt-4 flex sm:flex-col gap-1 opacity-60">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />)}
                  </div>
                </div>

                {/* الجزء الأيسر (بيانات الكوبون) */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-black tracking-widest text-foreground uppercase">EID2024</h3>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full hover:bg-primary/10 text-primary"
                          onClick={() => copyToClipboard("EID2024")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">كوبون بمناسبة عيد الفطر المبارك</p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-full px-4">نشط</Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-2 rounded-xl">
                      <Calendar className="h-4 w-4 text-primary" />
                      ينتهي: 30 يونيو، 2024
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted/50 px-3 py-2 rounded-xl">
                      <Ticket className="h-4 w-4 text-primary" />
                      استخدم: 142 مرة
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 rounded-xl h-11 font-bold border-border/50">تعديل الكوبون</Button>
                    <Button variant="ghost" className="rounded-xl h-11 w-12 text-destructive hover:bg-destructive/10"><Trash2 className="h-5 w-5" /></Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}