import { supabase } from '../lib/supabase';

const ROOT_KEY = "0f19bb22-ad64-45d2-abc9-ad5686a978dc";
const LOCK_TIMESTAMP_MS = 1730013441000;
const COLLAPSE_INTERVAL_MS = 900;
const CARE_RATE = 0.15;

export interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  status: 'BUILDING' | 'READY' | 'COMPLETED';
  owner: string;
  atomicKey?: string;
}

export const PRODUCT_CATALOG = {
  'Sovereign': { name: "FAA Sovereign License", price: 20138.16, unit: 'ECR/R' },
  'Starter': { name: "VM-HS-Starter-7038-KEY", price: 29.00, unit: 'USD' },
  'Data': { name: "Multi-Dim Data Stream", price: 4000.00, unit: 'ECR/R' },
  'ProGrid': { name: "MineNest Pro Grid License", price: 230.00, unit: 'USD' },
  'Banimal': { name: "Banimal Loop Plan", price: 499.00, unit: 'USD' }
};

export class VaultMeshService {
  static calculateTotals(cart: Cart) {
    let subtotal = 0;
    cart.items.forEach(item => {
      subtotal += item.price * item.quantity;
    });

    const careSplit = subtotal * CARE_RATE;
    const totalDue = subtotal + careSplit;

    return { subtotal, careSplit, totalDue };
  }

  static generateAtomicKey(userCreationTimeMs: number): string {
    const timeElapsedMs = userCreationTimeMs - LOCK_TIMESTAMP_MS;
    const totalStrikes = Math.floor(timeElapsedMs / COLLAPSE_INTERVAL_MS);
    const storeID = (timeElapsedMs / 1000).toFixed(3);

    const DECOHERENCE_FRACTION = (0.1 / 0.9);
    const decoherenceTraceValue = (timeElapsedMs / 1000 * DECOHERENCE_FRACTION).toFixed(10);

    const newAtomicKey =
      `[TR:${totalStrikes.toString(16).toUpperCase().padStart(8, '0')}]` +
      `{ID:${storeID}}` +
      `<DC:${decoherenceTraceValue.substring(0, 10)}>` +
      `[ANCHOR:${ROOT_KEY.substring(0, 8)}]`;

    return newAtomicKey;
  }

  static async createOrder(cart: Cart, paymentMethod: 'paypal' | 'payfast') {
    const totals = this.calculateTotals(cart);
    const atomicKey = this.generateAtomicKey(Date.now());

    const { data, error } = await supabase
      .from('orders')
      .insert({
        cart_id: atomicKey,
        customer_id: cart.owner,
        total_amount: totals.totalDue,
        total_grains: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        status: 'completed'
      })
      .select()
      .single();

    if (error) throw error;

    const careLoopAmount = totals.careSplit;
    const animalsHelped = careLoopAmount / 12.5;

    await supabase
      .from('care_loop_transactions')
      .insert({
        source_order_id: data.order_id,
        amount: careLoopAmount,
        beneficiary: 'Banimals',
        animals_helped: animalsHelped
      });

    return { order: data, atomicKey };
  }
}

export interface BrandAuditStats {
  totalBrands: number;
  waterSeedTarget: number;
  achievementPercent: number;
  validatedPercent: number;
  placeholderPercent: number;
  tierBreakdown: {
    tier: string;
    count: number;
    avgFee: number;
    avgRoyalty: number;
  }[];
}

export const BRAND_AUDIT_DATA: BrandAuditStats = {
  totalBrands: 13713,
  waterSeedTarget: 9000,
  achievementPercent: 152.4,
  validatedPercent: 84.1,
  placeholderPercent: 15.9,
  tierBreakdown: [
    { tier: 'Sovereign', count: 440, avgFee: 20138.16, avgRoyalty: 20.14 },
    { tier: 'Dynastic', count: 1202, avgFee: 10910.51, avgRoyalty: 19.71 },
    { tier: 'Operational', count: 1098, avgFee: 6553.71, avgRoyalty: 15.63 },
    { tier: 'Market', count: 4604, avgFee: 3351.61, avgRoyalty: 7.86 }
  ]
};
