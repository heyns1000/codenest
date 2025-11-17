import { supabase } from '../lib/supabase';

export class BareCartService {
  static async createProduct(
    name: string,
    price: number,
    quantity: number,
    grainsPerUnit: number = 1
  ) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        price,
        quantity,
        grains_per_unit: grainsPerUnit
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getProduct(itemId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('item_id', itemId)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProductQuantity(itemId: string, quantityChange: number) {
    const product = await this.getProduct(itemId);
    const newQuantity = product.quantity + quantityChange;

    if (newQuantity < 0) {
      throw new Error('Insufficient quantity');
    }

    const { data, error } = await supabase
      .from('products')
      .update({ quantity: newQuantity })
      .eq('item_id', itemId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createOrder(
    cartId: string,
    customerId: string,
    items: Array<{ itemId: string; quantity: number }>
  ) {
    let totalAmount = 0;
    let totalGrains = 0;

    for (const item of items) {
      const product = await this.getProduct(item.itemId);

      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient quantity for ${product.name}`);
      }

      totalAmount += product.price * item.quantity;
      totalGrains += product.grains_per_unit * item.quantity;

      await this.updateProductQuantity(item.itemId, -item.quantity);
    }

    const { data, error } = await supabase
      .from('orders')
      .insert({
        cart_id: cartId,
        customer_id: customerId,
        total_amount: totalAmount,
        total_grains: totalGrains,
        status: 'completed'
      })
      .select()
      .single();

    if (error) throw error;

    const careLoopAmount = totalAmount * 0.15;
    const animalsHelped = careLoopAmount / 12.5;

    await supabase
      .from('care_loop_transactions')
      .insert({
        source_order_id: data.order_id,
        amount: careLoopAmount,
        beneficiary: 'Banimals',
        animals_helped: animalsHelped
      });

    return data;
  }

  static async getOrdersByCustomer(customerId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', customerId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getOrder(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) throw error;
    return data;
  }

  static calculateGrains(items: Array<{ price: number; quantity: number; grainsPerUnit: number }>) {
    return items.reduce((total, item) => {
      return total + (item.grainsPerUnit * item.quantity);
    }, 0);
  }
}
