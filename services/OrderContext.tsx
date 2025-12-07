
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, CartItem, Rider } from '../types';
import { useAuth } from './AuthContext';
import { COMPANY_INFO, RIDERS } from '../constants';
import { useToast } from './ToastContext';

// Declare jsPDF types for the window object
declare global {
  interface Window {
    jspdf: any;
  }
}

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], total: number, address: string, paymentMethod: string, phone: string, name: string) => Promise<string>;
  getOrderById: (id: string) => Order | undefined;
  generateInvoice: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  assignRider: (orderId: string, riderId: string) => void;
  cancelOrder: (orderId: string) => Promise<boolean>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const DB_ORDERS_KEY = 'freshleaf_orders_db';

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from local storage
  useEffect(() => {
    const storedOrders = localStorage.getItem(DB_ORDERS_KEY);
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(newOrders));
  };

  const generateInvoice = (order: Order) => {
    if (!window.jspdf) {
      console.error("jsPDF library not loaded");
      addToast("PDF Library not loaded", "error");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Brand Header
    doc.setFillColor(76, 175, 80); // FreshLeaf Green
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text('FreshLeaf', 15, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Premium Organic Produce', 15, 26);
    
    doc.setFontSize(16);
    doc.text('INVOICE', 180, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.text(`#${order.id}`, 180, 26, { align: 'right' });

    // Company Info
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.text(`From:`, 15, 55);
    doc.setFont("helvetica", "bold");
    doc.text(COMPANY_INFO.name, 15, 60);
    doc.setFont("helvetica", "normal");
    doc.text(COMPANY_INFO.address, 15, 65);
    doc.text(`Phone: ${COMPANY_INFO.phone}`, 15, 70);
    doc.text(`Email: ${COMPANY_INFO.email}`, 15, 75);

    // Bill To
    doc.text(`Bill To:`, 110, 55);
    doc.setFont("helvetica", "bold");
    doc.text(`${order.customerName || 'Customer'}`, 110, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`${order.customerPhone || ''}`, 110, 65);
    // Split long address
    const splitAddress = doc.splitTextToSize(order.address, 80);
    doc.text(splitAddress, 110, 70);

    // Order Meta
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 85, 195, 85);
    
    doc.text(`Order Date: ${order.date}`, 15, 92);
    doc.text(`Payment: ${order.paymentMethod}`, 80, 92);
    doc.text(`Courier: ${order.courier || 'Bombax Logistics'}`, 140, 92);

    // Items Table
    const tableColumn = ["Item", "Unit", "Qty", "Price", "Total"];
    const tableRows: any[] = [];

    order.items.forEach(item => {
      const itemData = [
        item.name.en,
        item.selectedUnit,
        item.quantity,
        `Rs. ${item.price}`,
        `Rs. ${item.price * item.quantity}`
      ];
      tableRows.push(itemData);
    });

    // @ts-ignore
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 100,
      theme: 'grid',
      headStyles: { fillColor: [76, 175, 80], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
          0: { cellWidth: 80 },
          4: { fontStyle: 'bold', halign: 'right' },
          3: { halign: 'right' }
      }
    });

    // Total
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.text("Subtotal:", 140, finalY);
    doc.text(`Rs. ${order.total}`, 195, finalY, { align: 'right' });
    
    doc.text("Shipping:", 140, finalY + 5);
    doc.text("Rs. 0", 195, finalY + 5, { align: 'right' });
    
    doc.setFillColor(240, 240, 240);
    doc.rect(135, finalY + 10, 65, 12, 'F');
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Grand Total:", 140, finalY + 18);
    doc.text(`Rs. ${order.total}`, 195, finalY + 18, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for shopping with FreshLeaf.', 105, 275, { align: 'center' });
    doc.text('For support: +91 8513028892 | subhajitabir@gmail.com', 105, 280, { align: 'center' });
    
    // Save
    doc.save(`FreshLeaf_Invoice_${order.id}.pdf`);
  };

  const createOrder = async (items: CartItem[], total: number, address: string, paymentMethod: string, phone: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing delay
    
    const orderId = 'FL-' + Math.floor(100000 + Math.random() * 900000);
    const trackingId = 'BMX-' + Math.random().toString(36).substr(2, 9).toUpperCase(); // BMX prefix for Bombax
    
    const newOrder: Order = {
      id: orderId,
      userId: user?.id || 'guest',
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' }),
      timestamp: Date.now(),
      total,
      status: 'Processing',
      items,
      paymentMethod,
      address,
      trackingId,
      courier: 'Bombax',
      customerName: name,
      customerPhone: phone
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    
    // Simulate WhatsApp Notification logic
    const waMessage = `*New Order Placed!* %0A%0AOrder ID: ${newOrder.id}%0ACustomer: ${name}%0APhone: ${phone}%0AEmail: ${user?.email || 'Guest'}%0AAddress: ${address}%0AItems: ${items.map(i => `${i.quantity}x ${i.name.en}`).join(', ')}%0ATotal: ₹${total}%0A%0AInvoice PDF has been generated and sent.`;
    
    // Simulate sending to Company
    console.log(`[WhatsApp Bot] Sending to Company (${COMPANY_INFO.whatsapp}):`, waMessage);
    
    // Simulate sending to User
    console.log(`[WhatsApp Bot] Sending to User (${phone}):`, waMessage);
    
    addToast('Order details sent to your WhatsApp successfully!', 'success');
    addToast('Invoice PDF sent to your WhatsApp.', 'success');
    
    return newOrder.id;
  };

  const cancelOrder = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    // 5 Minute check
    const timeDiff = Date.now() - order.timestamp;
    if (timeDiff > 5 * 60 * 1000) {
      addToast('Cancellation window (5 mins) has expired.', 'error');
      return false;
    }

    if (order.status !== 'Processing') {
      addToast('Order cannot be cancelled at this stage.', 'error');
      return false;
    }

    const updatedOrders = orders.map(o => 
      o.id === orderId ? { ...o, status: 'Cancelled' as const } : o
    );
    saveOrders(updatedOrders);
    
    // Simulate WhatsApp Cancellation update
    const message = `Order ${orderId} has been CANCELLED by the user.`;
    console.log(`[WhatsApp Bot] Sending Cancellation to Company & User: ${message}`);
    addToast('Order cancelled. Update sent to WhatsApp.', 'success');

    return true;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        // Trigger WhatsApp Notification Simulation
        if (o.customerPhone) {
          const message = `Hi ${o.customerName}, your FreshLeaf order ${o.id} is now ${status}.`;
          const url = `https://wa.me/91${o.customerPhone}?text=${encodeURIComponent(message)}`;
          console.log(`WhatsApp Notification URL prepared: ${url}`);
        }
        return { ...o, status };
      }
      return o;
    });
    saveOrders(updatedOrders);
    addToast(`Order ${orderId} status updated to ${status}`, 'success');
  };

  const assignRider = (orderId: string, riderId: string) => {
    const rider = RIDERS.find(r => r.id === riderId);
    if (!rider) return;

    const updatedOrders = orders.map(o => 
      o.id === orderId ? { ...o, riderId: rider.id, riderName: rider.name, courier: 'FreshLeaf Fleet' } : o
    );
    saveOrders(updatedOrders);
    addToast(`Rider ${rider.name} assigned to order ${orderId}`, 'success');
  };

  const getOrderById = (id: string) => {
    return orders.find(o => o.id === id);
  };

  const userOrders = user ? orders.filter(o => o.userId === user.id) : [];

  return (
    <OrderContext.Provider value={{ orders: user?.isAdmin ? orders : userOrders, createOrder, getOrderById, generateInvoice, updateOrderStatus, assignRider, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within an OrderProvider');
  return context;
};
