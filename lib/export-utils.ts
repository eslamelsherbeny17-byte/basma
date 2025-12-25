import * as XLSX from 'xlsx'
import { Product } from './types'

export function exportProductsToExcel(
  products: Product[],
  filename: string = 'products.xlsx'
) {
  // Prepare data for export
  const exportData = products.map((product) => ({
    'رقم المنتج': product._id,
    الاسم: product.title || product.title,
    الفئة: product.category.name || product.category.name,
    السعر: product.price,
    'السعر بعد الخصم': product.priceAfterDiscount || '-',
    'الكمية المتاحة': product.quantity,
    المبيعات: product.sold,
    التقييم: product.ratingsAverage,
    'عدد التقييمات': product.ratingsQuantity,
  }))

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(exportData)

  // Set column widths
  ws['!cols'] = [
    { wch: 15 }, // رقم المنتج
    { wch: 30 }, // الاسم
    { wch: 15 }, // الفئة
    { wch: 10 }, // السعر
    { wch: 15 }, // السعر بعد الخصم
    { wch: 12 }, // الكمية
    { wch: 10 }, // المبيعات
    { wch: 10 }, // التقييم
    { wch: 12 }, // عدد التقييمات
  ]

  // Create workbook
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'المنتجات')

  // Save file
  XLSX.writeFile(wb, filename)
}

export function exportOrdersToExcel(
  orders: any[],
  filename: string = 'orders.xlsx'
) {
  const exportData = orders.map((order) => ({
    'رقم الطلب': order._id,
    العميل: order.user.name,
    'البريد الإلكتروني': order.user.email,
    'المبلغ الإجمالي': order.totalOrderPrice,
    'طريقة الدفع': order.paymentMethodType === 'cash' ? 'نقدي' : 'بطاقة',
    'حالة الدفع': order.isPaid ? 'مدفوع' : 'غير مدفوع',
    'حالة الطلب': order.status,
    التاريخ: new Date(order.createdAt).toLocaleDateString('ar-EG'),
  }))

  const ws = XLSX.utils.json_to_sheet(exportData)
  ws['!cols'] = [
    { wch: 15 },
    { wch: 20 },
    { wch: 25 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, wb, 'الطلبات')

  XLSX.writeFile(wb, filename)
}

export function exportUsersToExcel(
  users: any[],
  filename: string = 'users.xlsx'
) {
  const exportData = users.map((user) => ({
    'رقم المستخدم': user._id,
    الاسم: user.name,
    'البريد الإلكتروني': user.email,
    'رقم الهاتف': user.phone || '-',
    الدور: user.role === 'admin' ? 'مدير' : 'مستخدم',
    'عدد الطلبات': user.ordersCount || 0,
    'إجمالي الإنفاق': user.totalSpent || 0,
    'تاريخ التسجيل': new Date(user.createdAt).toLocaleDateString('ar-EG'),
  }))

  const ws = XLSX.utils.json_to_sheet(exportData)
  ws['!cols'] = [
    { wch: 15 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 10 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'المستخدمين')

  XLSX.writeFile(wb, filename)
}

// Import from Excel
export async function importProductsFromExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        resolve(jsonData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = (error) => reject(error)
    reader.readAsBinaryString(file)
  })
}
