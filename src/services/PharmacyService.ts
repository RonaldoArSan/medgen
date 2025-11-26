import { PharmacyProduct } from '../types';
import { MOCK_PHARMACY_PRODUCTS } from './mockData';

class PharmacyService {
  static async getProducts(): Promise<PharmacyProduct[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_PHARMACY_PRODUCTS;
  }

  static async getProductById(id: string): Promise<PharmacyProduct | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PHARMACY_PRODUCTS.find(p => p.id === id);
  }

  static async searchProducts(query: string): Promise<PharmacyProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowerQuery = query.toLowerCase();
    return MOCK_PHARMACY_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery)
    );
  }

  static async getProductsByCategory(category: string): Promise<PharmacyProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PHARMACY_PRODUCTS.filter(p => p.category === category);
  }

  static async findProductForMedication(medicationName: string): Promise<PharmacyProduct | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowerMedName = medicationName.toLowerCase();
    
    // 1. Exact match or very close match
    const exactMatch = MOCK_PHARMACY_PRODUCTS.find(p => 
      p.name.toLowerCase() === lowerMedName ||
      p.name.toLowerCase().includes(lowerMedName) ||
      lowerMedName.includes(p.name.toLowerCase())
    );
    
    if (exactMatch) return exactMatch;

    // 2. Split words and find best match (simple heuristic)
    const medWords = lowerMedName.split(' ').filter(w => w.length > 3);
    
    for (const word of medWords) {
      const match = MOCK_PHARMACY_PRODUCTS.find(p => 
        p.name.toLowerCase().includes(word)
      );
      if (match) return match;
    }

    return undefined;
  }
}

export default PharmacyService;
