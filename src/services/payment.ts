import { supabase } from '../lib/supabase';
import { Cart } from './vaultmesh';
import { LicenseService } from './license';

export interface PaymentTransaction {
  transaction_id: string;
  order_id: string;
  gateway: 'paypal' | 'payfast';
  gateway_transaction_id: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  customer_email: string;
  payment_data: Record<string, any>;
  created_at: string;
  completed_at: string | null;
}

export interface PaymentResult {
  success: boolean;
  transaction: PaymentTransaction;
  license?: any;
  error?: string;
}

export class PaymentService {
  static async createPaymentTransaction(
    orderId: string,
    gateway: 'paypal' | 'payfast',
    amount: number,
    customerEmail: string,
    currency: string = 'ZAR'
  ): Promise<PaymentTransaction> {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert({
        order_id: orderId,
        gateway,
        amount,
        currency,
        customer_email: customerEmail,
        status: 'pending'
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to create payment transaction');

    return data as PaymentTransaction;
  }

  static async completePaymentTransaction(
    transactionId: string,
    gatewayTransactionId: string,
    paymentData: Record<string, any>
  ): Promise<void> {
    const { error } = await supabase
      .from('payment_transactions')
      .update({
        status: 'completed',
        gateway_transaction_id: gatewayTransactionId,
        payment_data: paymentData,
        completed_at: new Date().toISOString()
      })
      .eq('transaction_id', transactionId);

    if (error) throw error;
  }

  static async processPayPalPayment(
    cart: Cart,
    customerEmail: string,
    customerName: string
  ): Promise<PaymentResult> {
    try {
      const totals = await import('./vaultmesh').then(m => m.VaultMeshService.calculateTotals(cart));

      const result = await import('./vaultmesh').then(m =>
        m.VaultMeshService.createOrder(cart, 'paypal')
      );

      const transaction = await this.createPaymentTransaction(
        result.order.order_id,
        'paypal',
        totals.totalDue,
        customerEmail,
        'ZAR'
      );

      const items = cart.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit_amount: item.price
      }));

      const baseUrl = window.location.origin;
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paypal-create-order`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totals.totalDue,
          currency: 'USD',
          items,
          userId: null,
          returnUrl: `${baseUrl}/payment-return?provider=paypal`,
          cancelUrl: `${baseUrl}/payment-cancel?provider=paypal`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }

      const { orderId, approvalUrl } = await response.json();

      window.location.href = approvalUrl;

      return {
        success: true,
        transaction: {
          ...transaction,
          gateway_transaction_id: orderId,
        }
      };
    } catch (error) {
      return {
        success: false,
        transaction: {} as PaymentTransaction,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  static async processPayFastPayment(
    cart: Cart,
    customerEmail: string,
    customerName: string
  ): Promise<PaymentResult> {
    try {
      const totals = await import('./vaultmesh').then(m => m.VaultMeshService.calculateTotals(cart));

      const result = await import('./vaultmesh').then(m =>
        m.VaultMeshService.createOrder(cart, 'payfast')
      );

      const transaction = await this.createPaymentTransaction(
        result.order.order_id,
        'payfast',
        totals.totalDue,
        customerEmail,
        'ZAR'
      );

      const productName = cart.items.map(item => item.name).join(', ');
      const [firstName, ...lastNameParts] = customerName.split(' ');
      const lastName = lastNameParts.join(' ');

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payfast-initiate`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totals.totalDue,
          itemName: productName,
          itemDescription: `Nexus Nair License: ${productName}`,
          email: customerEmail,
          nameFirst: firstName,
          nameLast: lastName,
          userId: null,
          licenseType: productName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate PayFast payment');
      }

      const { paymentUrl, paymentData } = await response.json();

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentUrl;

      Object.keys(paymentData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      return {
        success: true,
        transaction: {
          ...transaction,
          gateway_transaction_id: paymentData.m_payment_id,
        }
      };
    } catch (error) {
      return {
        success: false,
        transaction: {} as PaymentTransaction,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }
}
