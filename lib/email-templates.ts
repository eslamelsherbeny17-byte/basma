export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export function getOrderConfirmationEmail(order: any): EmailTemplate {
  return {
    subject: `تأكيد الطلب #${order._id} - أيمن باشر`,
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f9f7f2;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #D4AF37 0%, #F5CD3F 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .content {
            padding: 30px;
          }
          .order-info {
            background: #f9f7f2;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .product-item {
            display: flex;
            justify-content: space-between;
            padding: 15px 0;
            border-bottom: 1px solid #e5e5e5;
          }
          .total {
            background: #1E293B;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
          }
          .footer {
            background: #1E293B;
            color: white;
            padding: 20px;
            text-align: center;
            font-size: 14px;
          }
          .btn {
            display: inline-block;
            background: #D4AF37;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ تم تأكيد طلبك</h1>
            <p>شكراً لك على الطلب من أيمن باشر</p>
          </div>
          
          <div class="content">
            <h2>مرحباً ${order.user.name}،</h2>
            <p>تم استلام طلبك بنجاح وهو الآن قيد المعالجة.</p>
            
            <div class="order-info">
              <h3>تفاصيل الطلب</h3>
              <p><strong>رقم الطلب:</strong> ${order._id}</p>
              <p><strong>التاريخ:</strong> ${new Date(
                order.createdAt
              ).toLocaleDateString('ar-EG')}</p>
              <p><strong>طريقة الدفع:</strong> ${
                order.paymentMethodType === 'cash'
                  ? 'الدفع عند الاستلام'
                  : 'بطاقة ائتمان'
              }</p>
            </div>

            <h3>المنتجات المطلوبة:</h3>
            ${order.cartItems
              .map(
                (item: any) => `
              <div class="product-item">
                <div>
                  <strong>${item.product.titleAr}</strong>
                  <p>الكمية: ${item.quantity}</p>
                </div>
                <div>${item.price * item.quantity} جنيه</div>
              </div>
            `
              )
              .join('')}

            <div class="total">
              الإجمالي: ${order.totalOrderPrice} جنيه
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/orders/${
      order._id
    }" class="btn">
                تتبع الطلب
              </a>
            </div>

            <h3>عنوان الشحن:</h3>
            <div class="order-info">
              <p>${order.shippingAddress.details}</p>
              <p>${order.shippingAddress.city}</p>
              <p>رقم الهاتف: ${order.user.phone}</p>
            </div>
          </div>

          <div class="footer">
            <p>شكراً لاختياركم أيمن باشر</p>
            <p>للاستفسارات: info@aymanbasher.com | +20 123 456 7890</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
تأكيد الطلب #${order._id}

عزيزي/عزيزتي ${order.user.name}،

تم استلام طلبك بنجاح!

تفاصيل الطلب:
- رقم الطلب: ${order._id}
- التاريخ: ${new Date(order.createdAt).toLocaleDateString('ar-EG')}
- الإجمالي: ${order.totalOrderPrice} جنيه

شكراً لك،
فريق أيمن باشر
    `,
  }
}

export function getOrderShippedEmail(order: any): EmailTemplate {
  return {
    subject: `تم شحن طلبك #${order._id} - أيمن باشر`,
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          /* Same styles as above */
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 تم شحن طلبك</h1>
          </div>
          
          <div class="content">
            <h2>مرحباً ${order.user.name}،</h2>
            <p>طلبك في الطريق إليك!</p>
            
            <div class="order-info">
              <h3>معلومات الشحن</h3>
              <p><strong>رقم الطلب:</strong> ${order._id}</p>
              <p><strong>رقم الشحنة:</strong> ${
                order.trackingNumber || 'يتم تحديثه قريباً'
              }</p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/track/${
      order._id
    }" class="btn">
                تتبع الشحنة
              </a>
            </div>

            <p>سيصل طلبك خلال 3-5 أيام عمل.</p>
          </div>

          <div class="footer">
            <p>شكراً لاختياركم أيمن باشر</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `تم شحن طلبك #${order._id}`,
  }
}

export function getWelcomeEmail(user: any): EmailTemplate {
  return {
    subject: 'مرحباً بك في أيمن باشر! 🎉',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 مرحباً بك في عائلة أيمن باشر</h1>
          </div>
          
          <div class="content">
            <h2>عزيزي/عزيزتي ${user.name}،</h2>
            <p>نحن سعداء بانضمامك إلينا!</p>
            
            <p>استمتع بتجربة تسوق فريدة مع أفضل الأزياء الإسلامية العصرية.</p>

            <div class="order-info">
              <h3>احصل على خصم 10% على أول طلب!</h3>
              <p>استخدم الكود: <strong>WELCOME10</strong></p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/shop" class="btn">
                ابدأ التسوق الآن
              </a>
            </div>
          </div>

          <div class="footer">
            <p>نتطلع لخدمتك</p>
            <p>فريق أيمن باشر</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `مرحباً ${user.name}! نحن سعداء بانضمامك إلى أيمن باشر.`,
  }
}

export function getPasswordResetEmail(
  user: any,
  resetToken: string
): EmailTemplate {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${resetToken}`

  return {
    subject: 'إعادة تعيين كلمة المرور - أيمن باشر',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 إعادة تعيين كلمة المرور</h1>
          </div>
          
          <div class="content">
            <h2>مرحباً ${user.name}،</h2>
            <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="btn">
                إعادة تعيين كلمة المرور
              </a>
            </div>

            <p>إذا لم تطلب ذلك، يرجى تجاهل هذه الرسالة.</p>
            <p><strong>ملاحظة:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
          </div>

          <div class="footer">
            <p>فريق أيمن باشر</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `إعادة تعيين كلمة المرور: ${resetUrl}`,
  }
}
