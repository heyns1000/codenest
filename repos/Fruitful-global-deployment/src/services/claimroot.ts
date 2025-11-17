import { supabase } from '../lib/supabase';

export class ClaimRootService {
  private static async calculateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async createClaim(owner: string, asset: string, metadata: Record<string, any> = {}) {
    const { data: lastClaim } = await supabase
      .from('claims')
      .select('current_hash')
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    const timestamp = new Date().toISOString();
    const dataToHash = `${owner}${asset}${timestamp}${lastClaim?.current_hash || ''}`;
    const currentHash = await this.calculateHash(dataToHash);

    const { data, error } = await supabase
      .from('claims')
      .insert({
        owner,
        asset,
        previous_hash: lastClaim?.current_hash || null,
        current_hash: currentHash,
        metadata
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async verifyClaim(claimId: string): Promise<boolean> {
    const { data: claim } = await supabase
      .from('claims')
      .select('*')
      .eq('claim_id', claimId)
      .single();

    if (!claim) return false;

    const dataToHash = `${claim.owner}${claim.asset}${claim.timestamp}${claim.previous_hash || ''}`;
    const calculatedHash = await this.calculateHash(dataToHash);

    return calculatedHash === claim.current_hash;
  }

  static async getClaimsByOwner(owner: string) {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('owner', owner)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getClaimsByAsset(asset: string) {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('asset', asset)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  }
}
