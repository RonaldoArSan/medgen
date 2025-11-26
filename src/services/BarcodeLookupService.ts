import { Medication } from '../types';

// Mock database of barcodes
const BARCODE_DB: Record<string, Partial<Medication>> = {
  '7891010101010': {
    name: 'Dipirona Sódica',
    dosage: '500mg',
    form: 'Comprimido',
    instructions: 'Tomar em caso de dor ou febre.',
  },
  '7892020202020': {
    name: 'Paracetamol',
    dosage: '750mg',
    form: 'Comprimido',
    instructions: 'Tomar a cada 6 horas se necessário.',
  },
  '7893030303030': {
    name: 'Ibuprofeno',
    dosage: '600mg',
    form: 'Cápsula',
    instructions: 'Tomar após as refeições.',
  },
};

class BarcodeLookupService {
  static async lookupBarcode(code: string): Promise<Partial<Medication> | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const result = BARCODE_DB[code];
    return result || null;
  }
}

export default BarcodeLookupService;
