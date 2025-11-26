import { v4 as uuidv4 } from 'uuid';
import { Order, OrderItem, OrderStatus } from '../types';
import LocalStorageService from './LocalStorageService';

const ORDERS_KEY = '@orders';

class OrderService {
  static async getOrders(): Promise<Order[]> {
    const stored = await LocalStorageService.getItem<Order[]>(ORDERS_KEY);
    return stored || [];
  }

  static async createOrder(userId: string, items: OrderItem[], shippingAddress: string): Promise<Order> {
    const orders = await this.getOrders();
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: uuidv4(),
      userId,
      items,
      total,
      status: 'pending',
      date: new Date().toISOString(),
      shippingAddress,
    };
    
    const updatedOrders = [newOrder, ...orders];
    await LocalStorageService.setItem(ORDERS_KEY, updatedOrders);
    
    return newOrder;
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const orders = await this.getOrders();
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    await LocalStorageService.setItem(ORDERS_KEY, updatedOrders);
  }
}

export default OrderService;
