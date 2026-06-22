import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../types';

export function generateInvoice(order: Order, orderId: string) {
  const doc = new jsPDF();
  
  // Constants
  const brandName = "Cloud Bloom";
  const brandSubtext = "Handcrafted Amigurumi & Wonders";
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;

  // Header Background
  doc.setFillColor(250, 246, 240); // --color-surface
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Brand Logo / Title
  doc.setFontSize(24);
  doc.setTextColor(196, 98, 45); // --color-primary
  doc.text(brandName, margin, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(brandSubtext, margin, 30);

  // Invoice Title
  doc.setFontSize(16);
  doc.setTextColor(50, 50, 50);
  doc.text("INVOICE", pageWidth - margin, 25, { align: 'right' });

  // Order Info
  doc.setFontSize(10);
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
  doc.text(`Order ID: #${orderId.slice(0, 8).toUpperCase()}`, pageWidth - margin, 32, { align: 'right' });
  doc.text(`Date: ${formattedDate}`, pageWidth - margin, 38, { align: 'right' });

  // Customer Details
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Bill To:", margin, 55);
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  let y = 62;
  const lines = [
    order.customerName,
    `WhatsApp: ${order.customerWhatsapp}`,
    order.address,
    `${order.city}, ${order.state} ${order.zip}`
  ];
  
  lines.forEach(line => {
    if (line) {
      doc.text(line, margin, y);
      y += 6;
    }
  });

  // Table
  const tableData = order.items?.map((item: any) => [
    item.name,
    '1', // Quantity default to 1 as qty selector was removed
    `Rs. ${item.price.toFixed(2)}`,
    `Rs. ${item.price.toFixed(2)}`
  ]) || [];

  autoTable(doc, {
    startY: y + 10,
    head: [['Item Description', 'Qty', 'Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [196, 98, 45], // --color-primary
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 6,
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    }
  });

  // Summary (Total)
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text("Grand Total:", pageWidth - margin - 35, finalY, { align: 'right' });
  
  doc.setFontSize(14);
  doc.setTextColor(196, 98, 45); // --color-primary
  doc.text(`Rs. ${order.total?.toFixed(2) || '0.00'}`, pageWidth - margin, finalY, { align: 'right' });

  // Footer Note
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("Thank you for your order! Your yarn and hooks are on their way.", pageWidth / 2, finalY + 30, { align: 'center' });

  // Save the PDF
  doc.save(`CloudBloom_Invoice_${orderId.slice(0, 8)}.pdf`);
}
