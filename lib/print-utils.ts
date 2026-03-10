import type { Order } from "@/lib/types"

export function isLightColor(hex: string): boolean {
  const clean = hex.replace("#", "")
  const r = Number.parseInt(clean.slice(0, 2), 16)
  const g = Number.parseInt(clean.slice(2, 4), 16)
  const b = Number.parseInt(clean.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 186
}

/* ─── Shared thermal receipt CSS ─── */
const thermalBase = [
  "*{margin:0;padding:0;box-sizing:border-box}",
  "body{font-family:'Courier New',Courier,monospace;width:80mm;max-width:80mm;margin:0 auto;padding:4mm 3mm;color:#000;font-size:11px;line-height:1.4;direction:rtl}",
  ".center{text-align:center}",
  ".bold{font-weight:bold}",
  ".big{font-size:14px;font-weight:bold}",
  ".huge{font-size:18px;font-weight:bold;letter-spacing:1px}",
  ".sep{border-top:1px dashed #000;margin:4mm 0}",
  ".sep-double{border-top:2px solid #000;margin:4mm 0}",
  ".row{display:flex;justify-content:space-between;padding:1px 0}",
  ".item{margin-bottom:3mm;padding-bottom:2mm;border-bottom:1px dotted #ccc}",
  ".item:last-child{border-bottom:none}",
  ".item-name{font-weight:bold;font-size:12px;margin-bottom:1px}",
  ".item-detail{font-size:10px;color:#333}",
  ".total-section{margin-top:2mm}",
  ".grand-total{font-size:16px;font-weight:bold;margin-top:2mm}",
  "@media print{",
  "  @page{size:80mm auto;margin:0}",
  "  body{width:80mm;max-width:80mm;padding:2mm}",
  "}",
  "@media print and (max-width:62mm){",
  "  @page{size:58mm auto;margin:0}",
  "  body{width:58mm;max-width:58mm;font-size:10px}",
  "  .huge{font-size:15px}",
  "  .big{font-size:12px}",
  "}",
].join("")

function openPrintWindow(html: string) {
  const win = window.open("", "_blank")
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("ar-DZ", { year: "numeric", month: "short", day: "numeric" })
    + " " + d.toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" })
}

function itemName(item: any): string {
  return item.product_name || item.products?.name_ar || item.products?.name || "منتج"
}

/* ─── A4 Customer Invoice (Professional Detailed Format) ─── */
export function printInStoreInvoice(order: Order) {
  const items = order.order_items ?? []
  const dateStr = formatDate(order.created_at)
  const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0)
  const delivery = order.delivery_price || 0
  const total = order.total_price
  const invoiceNumber = "INV-" + order.order_code.replace("DD-", "")

  const itemsTableRows = items.map((item, i) => {
    const name = itemName(item)
    const dims = item.width && item.height ? `${item.width} × ${item.height} سم` : "-"
    const lineTotal = item.unit_price * item.quantity
    return `
      <tr>
        <td class="center">${i + 1}</td>
        <td>
          <div class="product-name">${name}</div>
          <div class="product-specs">
            ${item.selected_color ? `<span>اللون: ${item.selected_color}</span>` : ""}
            ${item.selected_handle ? `<span>المقبض: ${item.selected_handle}</span>` : ""}
          </div>
        </td>
        <td class="center">${dims}</td>
        <td class="center">${item.quantity}</td>
        <td class="number">${item.unit_price.toLocaleString()}</td>
        <td class="number highlight">${lineTotal.toLocaleString()}</td>
      </tr>
    `
  }).join("")

  const html = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>فاتورة ${order.order_code}</title>
  <style>
    @page {
      size: A4;
      margin: 12mm;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #1a1a1a;
      background: #fff;
      direction: rtl;
      padding: 15px;
    }
    
    .invoice {
      max-width: 210mm;
      margin: 0 auto;
      border: 2px solid #8B5A2B;
      border-radius: 8px;
      overflow: hidden;
    }
    
    /* Header */
    .header {
      background: linear-gradient(135deg, #8B5A2B 0%, #6d4722 100%);
      color: #fff;
      padding: 20px 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .brand {
      text-align: right;
    }
    
    .brand h1 {
      font-size: 26pt;
      font-weight: bold;
      margin-bottom: 3px;
    }
    
    .brand p {
      font-size: 10pt;
      opacity: 0.9;
    }
    
    .invoice-info {
      text-align: left;
      background: rgba(255,255,255,0.15);
      padding: 12px 18px;
      border-radius: 8px;
    }
    
    .invoice-title {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .invoice-number {
      font-size: 12pt;
      font-family: 'Courier New', monospace;
    }
    
    /* Body */
    .body {
      padding: 20px 25px;
    }
    
    /* Customer and Order Info Grid */
    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .info-box {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .info-box-header {
      background: #f5f0eb;
      padding: 8px 12px;
      font-weight: bold;
      color: #8B5A2B;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .info-box-content {
      padding: 12px;
    }
    
    .info-row {
      display: flex;
      margin-bottom: 6px;
    }
    
    .info-row:last-child {
      margin-bottom: 0;
    }
    
    .info-label {
      min-width: 80px;
      color: #666;
    }
    
    .info-value {
      font-weight: 500;
    }
    
    .info-value.highlight {
      color: #8B5A2B;
      font-weight: bold;
    }
    
    /* Products Table */
    .products-section {
      margin-bottom: 20px;
    }
    
    .section-title {
      font-size: 13pt;
      font-weight: bold;
      color: #8B5A2B;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 2px solid #8B5A2B;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10pt;
    }
    
    th {
      background: #f5f0eb;
      color: #8B5A2B;
      padding: 10px 8px;
      text-align: right;
      font-weight: bold;
      border-bottom: 2px solid #8B5A2B;
    }
    
    th.center, td.center {
      text-align: center;
    }
    
    th.number, td.number {
      text-align: left;
      font-family: 'Courier New', monospace;
    }
    
    td {
      padding: 10px 8px;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: top;
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    tr:nth-child(even) {
      background: #fafafa;
    }
    
    .product-name {
      font-weight: bold;
      color: #333;
      margin-bottom: 3px;
    }
    
    .product-specs {
      font-size: 9pt;
      color: #666;
      display: flex;
      gap: 12px;
    }
    
    td.highlight {
      font-weight: bold;
      color: #8B5A2B;
    }
    
    /* Summary */
    .summary-section {
      display: flex;
      justify-content: flex-end;
    }
    
    .summary-box {
      width: 280px;
      border: 2px solid #8B5A2B;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .summary-row:last-child {
      border-bottom: none;
    }
    
    .summary-row .label {
      color: #666;
    }
    
    .summary-row .value {
      font-family: 'Courier New', monospace;
      font-weight: 500;
    }
    
    .summary-row.grand-total {
      background: #8B5A2B;
      color: #fff;
    }
    
    .summary-row.grand-total .label,
    .summary-row.grand-total .value {
      color: #fff;
      font-weight: bold;
      font-size: 13pt;
    }
    
    /* Footer */
    .footer {
      background: #f5f0eb;
      padding: 15px 25px;
      text-align: center;
      border-top: 2px solid #8B5A2B;
    }
    
    .footer-brand {
      font-size: 14pt;
      font-weight: bold;
      color: #8B5A2B;
      margin-bottom: 5px;
    }
    
    .footer-thanks {
      font-size: 11pt;
      color: #666;
      margin-bottom: 8px;
    }
    
    .footer-contact {
      font-size: 9pt;
      color: #888;
    }
    
    .footer-date {
      margin-top: 10px;
      font-size: 8pt;
      color: #aaa;
    }
    
    /* Notes Section */
    .notes-section {
      margin-top: 20px;
      padding: 12px;
      background: #fffbf5;
      border: 1px dashed #8B5A2B;
      border-radius: 8px;
    }
    
    .notes-title {
      font-weight: bold;
      color: #8B5A2B;
      margin-bottom: 5px;
    }
    
    .notes-text {
      font-size: 10pt;
      color: #666;
    }
    
    /* Print button */
    .print-btn {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: #8B5A2B;
      color: #fff;
      border: none;
      padding: 12px 24px;
      font-size: 13pt;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 1000;
    }
    
    .print-btn:hover {
      background: #6d4722;
    }
    
    @media print {
      body {
        padding: 0;
      }
      .print-btn {
        display: none !important;
      }
      .invoice {
        border: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <!-- Header -->
    <div class="header">
      <div class="brand">
        <h1>Door & Decor</h1>
        <p>أبواب عصرية بتصميم فريد</p>
      </div>
      <div class="invoice-info">
        <div class="invoice-title">فاتورة</div>
        <div class="invoice-number">${invoiceNumber}</div>
      </div>
    </div>
    
    <!-- Body -->
    <div class="body">
      <!-- Customer and Order Info -->
      <div class="info-section">
        <div class="info-box">
          <div class="info-box-header">معلومات العميل</div>
          <div class="info-box-content">
            <div class="info-row">
              <span class="info-label">الاسم:</span>
              <span class="info-value highlight">${order.customer_name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">الهاتف:</span>
              <span class="info-value">${order.phone || "-"}</span>
            </div>
            ${order.email ? `
            <div class="info-row">
              <span class="info-label">البريد:</span>
              <span class="info-value">${order.email}</span>
            </div>
            ` : ""}
            ${order.state ? `
            <div class="info-row">
              <span class="info-label">الولاية:</span>
              <span class="info-value">${order.state}</span>
            </div>
            ` : ""}
            ${order.address ? `
            <div class="info-row">
              <span class="info-label">العنوان:</span>
              <span class="info-value">${order.address}</span>
            </div>
            ` : ""}
          </div>
        </div>
        
        <div class="info-box">
          <div class="info-box-header">معلومات الطلب</div>
          <div class="info-box-content">
            <div class="info-row">
              <span class="info-label">رمز الطلب:</span>
              <span class="info-value highlight">${order.order_code}</span>
            </div>
            <div class="info-row">
              <span class="info-label">التاريخ:</span>
              <span class="info-value">${dateStr}</span>
            </div>
            <div class="info-row">
              <span class="info-label">النوع:</span>
              <span class="info-value">${order.is_online ? "طلب اونلاين" : "طلب من المحل"}</span>
            </div>
            <div class="info-row">
              <span class="info-label">عدد المنتجات:</span>
              <span class="info-value">${items.length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Products Table -->
      <div class="products-section">
        <div class="section-title">تفاصيل المنتجات</div>
        <table>
          <thead>
            <tr>
              <th class="center" style="width: 40px;">#</th>
              <th>المنتج</th>
              <th class="center" style="width: 100px;">الأبعاد</th>
              <th class="center" style="width: 60px;">الكمية</th>
              <th class="number" style="width: 90px;">سعر الوحدة</th>
              <th class="number" style="width: 100px;">المجموع</th>
            </tr>
          </thead>
          <tbody>
            ${itemsTableRows}
          </tbody>
        </table>
      </div>
      
      <!-- Summary -->
      <div class="summary-section">
        <div class="summary-box">
          <div class="summary-row">
            <span class="label">المجموع الفرعي:</span>
            <span class="value">${subtotal.toLocaleString()} د.ج</span>
          </div>
          <div class="summary-row">
            <span class="label">التوصيل:</span>
            <span class="value">${delivery.toLocaleString()} د.ج</span>
          </div>
          <div class="summary-row grand-total">
            <span class="label">المجموع الكلي:</span>
            <span class="value">${total.toLocaleString()} د.ج</span>
          </div>
        </div>
      </div>
      
      <!-- Notes -->
      <div class="notes-section">
        <div class="notes-title">ملاحظات:</div>
        <div class="notes-text">
          يرجى الاحتفاظ بهذه الفاتورة كإثبات للشراء. للاستفسارات يرجى التواصل معنا.
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-brand">Door & Decor</div>
      <div class="footer-thanks">شكراً لثقتكم بنا - نتطلع لخدمتكم مجدداً</div>
      <div class="footer-date">تاريخ الطباعة: ${new Date().toLocaleString("ar-DZ")}</div>
    </div>
  </div>
  
  <button class="print-btn" onclick="window.print()">طباعة / حفظ PDF</button>
</body>
</html>
`

  openPrintWindow(html)
}

/* ─── Thermal Production Ticket (Bullet Point Format) ─── */
const ticketCSS = [
  "*{margin:0;padding:0;box-sizing:border-box}",
  "body{font-family:'Courier New',Courier,monospace;width:80mm;max-width:80mm;margin:0 auto;padding:4mm 3mm;color:#000;font-size:11px;line-height:1.5;direction:rtl}",
  ".center{text-align:center}",
  ".bold{font-weight:bold}",
  ".header-box{text-align:center;margin-bottom:3mm}",
  ".store-name{font-size:16px;font-weight:bold;letter-spacing:1px}",
  ".ticket-label{font-size:13px;font-weight:bold;border:2px solid #000;display:inline-block;padding:1.5mm 4mm;margin:2mm 0}",
  ".order-code{font-size:20px;font-weight:bold;background:#000;color:#fff;padding:2mm 3mm;margin:2mm 0;letter-spacing:2px}",
  ".date{font-size:10px;color:#333}",
  ".sep{border:none;border-top:1px dashed #000;margin:3mm 0}",
  ".sep-thick{border:none;border-top:2px solid #000;margin:3mm 0}",
  ".customer{margin:2mm 0}",
  ".customer-row{display:flex;justify-content:space-between;padding:0.5mm 0;font-size:11px}",
  ".door-block{margin:3mm 0;padding:0}",
  ".door-title{font-size:12px;font-weight:bold;margin-bottom:1.5mm;padding-right:1mm}",
  ".spec{padding:0.5mm 0 0.5mm 0;font-size:11px;padding-right:4mm}",
  ".spec::before{content:'\\2022  '}",
  ".door-divider{border:none;border-top:1px dotted #999;margin:3mm 0}",
  ".footer{text-align:center;font-size:9px;color:#666;margin-top:3mm}",
  "@media print{",
  "  @page{size:80mm auto;margin:0}",
  "  body{width:80mm;max-width:80mm;padding:2mm}",
  "}",
  "@media print and (max-width:62mm){",
  "  @page{size:58mm auto;margin:0}",
  "  body{width:58mm;max-width:58mm;font-size:10px}",
  "  .order-code{font-size:16px}",
  "  .store-name{font-size:13px}",
  "}",
].join("")

export function printInStoreTicket(order: Order) {
  const items = order.order_items ?? []
  const dateStr = formatDate(order.created_at)

  let itemsHtml = ""
  items.forEach((item, i) => {
    const name = itemName(item)
    const dims = item.width && item.height ? item.width + " x " + item.height + " سم" : ""

    if (i > 0) itemsHtml += '<hr class="door-divider">'

    itemsHtml += '<div class="door-block">'
      + '<div class="door-title">' + (i + 1) + ". " + name + "</div>"
      + (dims ? '<div class="spec">الابعاد: ' + dims + "</div>" : "")
      + (item.selected_color ? '<div class="spec">اللون: ' + item.selected_color + "</div>" : "")
      + (item.selected_handle ? '<div class="spec">المقبض: ' + item.selected_handle + "</div>" : "")
      + '<div class="spec">الكمية: ' + item.quantity + "</div>"
    + "</div>"
  })

  const html = '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8">'
    + "<title>تذكرة انتاج - " + order.order_code + "</title>"
    + "<style>" + ticketCSS + "</style></head><body>"
    // Header
    + '<div class="header-box">'
    + '<div class="store-name">Door & Decor</div>'
    + '<div class="ticket-label">تذكرة انتاج</div>'
    + '<div class="order-code">' + order.order_code + "</div>"
    + '<div class="date">' + dateStr + "</div>"
    + "</div>"
    + '<hr class="sep-thick">'
    // Customer
    + '<div class="customer">'
    + '<div class="customer-row"><span>العميل:</span><span class="bold">' + order.customer_name + "</span></div>"
    + (order.phone ? '<div class="customer-row"><span>الهاتف:</span><span>' + order.phone + "</span></div>" : "")
    + '<div class="customer-row"><span>عدد الابواب:</span><span class="bold">' + items.length + "</span></div>"
    + "</div>"
    + '<hr class="sep">'
    // Items as bullet specs
    + itemsHtml
    + '<hr class="sep-thick">'
    // Footer
    + '<div class="footer">Door & Decor - تذكرة انتاج داخلية</div>'
    + "<script>window.onload=function(){window.print()}<\/script>"
    + "</body></html>"

  openPrintWindow(html)
}
