import { v4 as uuidv4 } from 'uuid';
import { Medication } from '../types';
import LocalStorageService from './LocalStorageService';
import { MOCK_MEDICATIONS } from './mockData';
import OrderService from './OrderService';
import PharmacyService from './PharmacyService';

const STORAGE_KEY = '@medications';

class MedicationService {
  static async getLowStockMedications(): Promise<{ medication: Medication; isOnTheWay: boolean }[]> {
    const medications = await this.getMedications();
    const lowStockMeds = medications.filter(m => m.stock <= m.lowStockThreshold && m.active);
    
    const results = [];
    
    for (const med of lowStockMeds) {
      let isOnTheWay = false;
      
      // Find corresponding product
      const product = await PharmacyService.findProductForMedication(med.name);
      
      if (product) {
        // Check pending orders
        const orders = await OrderService.getOrders();
        const pendingOrders = orders.filter(o => 
          o.status === 'pending' || o.status === 'processing' || o.status === 'shipped'
        );
        
        for (const order of pendingOrders) {
          if (order.items.some(item => item.productId === product.id)) {
            isOnTheWay = true;
            break;
          }
        }
      }
      
      results.push({
        medication: med,
        isOnTheWay
      });
    }
    
    return results;
  }

  static async getMedications(): Promise<Medication[]> {
    const stored = await LocalStorageService.getItem<Medication[]>(STORAGE_KEY);
    if (!stored) {
      // Initialize with mock data if empty
      await LocalStorageService.setItem(STORAGE_KEY, MOCK_MEDICATIONS);
      return MOCK_MEDICATIONS;
    }
    return stored;
  }

  static async getMedicationById(id: string): Promise<Medication | undefined> {
    const medications = await this.getMedications();
    return medications.find(m => m.id === id);
  }

  static async addMedication(medication: Omit<Medication, 'id'>): Promise<Medication> {
    const medications = await this.getMedications();
    const newMedication = { ...medication, id: uuidv4() };
    const updatedList = [...medications, newMedication];
    await LocalStorageService.setItem(STORAGE_KEY, updatedList);
    return newMedication;
  }

  static async updateMedication(medication: Medication): Promise<void> {
    const medications = await this.getMedications();
    const updatedList = medications.map(m => m.id === medication.id ? medication : m);
    await LocalStorageService.setItem(STORAGE_KEY, updatedList);
  }

  static async deleteMedication(id: string): Promise<void> {
    const medications = await this.getMedications();
    const updatedList = medications.filter(m => m.id !== id);
    await LocalStorageService.setItem(STORAGE_KEY, updatedList);
  }

  static async updateStock(id: string, quantity: number): Promise<void> {
    const medications = await this.getMedications();
    const updatedList = medications.map(m => {
      if (m.id === id) {
        return { ...m, stock: Math.max(0, m.stock - quantity) };
      }
      return m;
    });
    await LocalStorageService.setItem(STORAGE_KEY, updatedList);
  }
}

export default MedicationService;
