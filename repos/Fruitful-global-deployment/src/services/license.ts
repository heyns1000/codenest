import { supabase } from '../lib/supabase';
import { Cart } from './vaultmesh';

export interface License {
  license_id: string;
  license_key: string;
  order_id: string;
  customer_email: string;
  customer_name: string;
  product_name: string;
  product_price: number;
  payment_method: 'paypal' | 'payfast';
  payment_transaction_id: string | null;
  status: 'active' | 'revoked' | 'expired';
  issued_at: string;
  expires_at: string | null;
  download_count: number;
  last_downloaded_at: string | null;
}

export class LicenseService {
  static generateLicenseKey(): string {
    const segments = [
      this.randomSegment(4),
      this.randomSegment(4),
      this.randomSegment(4),
      this.randomSegment(4),
      this.randomSegment(4)
    ];
    return segments.join('-');
  }

  private static randomSegment(length: number): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async createLicense(
    orderId: string,
    customerEmail: string,
    customerName: string,
    productName: string,
    productPrice: number,
    paymentMethod: 'paypal' | 'payfast',
    paymentTransactionId: string
  ): Promise<License> {
    const licenseKey = this.generateLicenseKey();

    const { data, error } = await supabase
      .from('licenses')
      .insert({
        license_key: licenseKey,
        order_id: orderId,
        customer_email: customerEmail,
        customer_name: customerName,
        product_name: productName,
        product_price: productPrice,
        payment_method: paymentMethod,
        payment_transaction_id: paymentTransactionId,
        status: 'active'
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to create license');

    return data as License;
  }

  static async getLicensesByEmail(email: string): Promise<License[]> {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('customer_email', email)
      .order('issued_at', { ascending: false });

    if (error) throw error;
    return (data || []) as License[];
  }

  static async getLicenseByKey(licenseKey: string): Promise<License | null> {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .maybeSingle();

    if (error) throw error;
    return data as License | null;
  }

  static async incrementDownloadCount(licenseId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_license_download', {
      license_id: licenseId
    });

    if (error) {
      const { data: license } = await supabase
        .from('licenses')
        .select('download_count')
        .eq('license_id', licenseId)
        .maybeSingle();

      if (license) {
        await supabase
          .from('licenses')
          .update({
            download_count: (license.download_count || 0) + 1,
            last_downloaded_at: new Date().toISOString()
          })
          .eq('license_id', licenseId);
      }
    }
  }

  static generateLicenseFile(license: License, cart: Cart): string {
    const issuedDate = new Date(license.issued_at).toLocaleString();
    const expiresText = license.expires_at
      ? new Date(license.expires_at).toLocaleString()
      : 'Lifetime License';

    const itemsList = cart.items
      .map(item => `  - ${item.name} (Qty: ${item.quantity}) - R${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');

    return `
═══════════════════════════════════════════════════════════════
                    FRUITFUL GLOBAL PLANET
                   VAULTMESH TREATY LICENSE
═══════════════════════════════════════════════════════════════

LICENSE KEY: ${license.license_key}

CUSTOMER INFORMATION:
  Name:  ${license.customer_name}
  Email: ${license.customer_email}

PURCHASE DETAILS:
  Order ID:      ${license.order_id}
  Transaction:   ${license.payment_transaction_id}
  Payment Method: ${license.payment_method.toUpperCase()}
  Amount Paid:   R${license.product_price.toFixed(2)}

LICENSED PRODUCTS:
${itemsList}

LICENSE STATUS:
  Status:     ${license.status.toUpperCase()}
  Issued:     ${issuedDate}
  Expires:    ${expiresText}

TREATY INFORMATION:
  Treaty ID:  FAA-TREATY-OMNI-4321-A13XN
  System:     NEXUS_NAIR VaultMesh
  Care Loop:  15% contributed to Banimals

TERMS & CONDITIONS:
  This license grants you access to the purchased VaultMesh systems
  and services. The license is non-transferable and is valid only
  for the customer email listed above. Misuse or sharing of this
  license key may result in immediate revocation.

  For support or questions, contact: support@fruitfulglobalplanet.com

═══════════════════════════════════════════════════════════════
              Thank you for supporting the Care Loop!
    Every grain counts. Every 9 seconds breathe. Every animal cares.
═══════════════════════════════════════════════════════════════
`.trim();
  }

  static downloadLicenseFile(licenseText: string, licenseKey: string): void {
    const blob = new Blob([licenseText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FruitfulGlobalPlanet_License_${licenseKey}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
