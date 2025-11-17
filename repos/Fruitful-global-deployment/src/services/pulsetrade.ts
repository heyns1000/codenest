import { supabase } from '../lib/supabase';

export class PulseTradeService {
  private static PULSE_INTERVAL = 9000;

  static getCurrentPulse(): number {
    return Math.floor(Date.now() / this.PULSE_INTERVAL);
  }

  static getNextPulseTime(): number {
    const currentPulse = this.getCurrentPulse();
    return (currentPulse + 1) * this.PULSE_INTERVAL;
  }

  static getTimeUntilNextPulse(): number {
    return this.getNextPulseTime() - Date.now();
  }

  static async createTrade(
    fromId: string,
    toId: string,
    asset: string,
    amount: number
  ) {
    const pulseNumber = this.getCurrentPulse();

    const { data, error } = await supabase
      .from('trades')
      .insert({
        from_id: fromId,
        to_id: toId,
        asset,
        amount,
        pulse_number: pulseNumber,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async completeTrade(tradeId: string) {
    const { data, error } = await supabase
      .from('trades')
      .update({ status: 'completed' })
      .eq('trade_id', tradeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPendingTrades() {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('status', 'pending')
      .order('pulse_number', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getTradesByPulse(pulseNumber: number) {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('pulse_number', pulseNumber)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getUserTrades(userId: string) {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .or(`from_id.eq.${userId},to_id.eq.${userId}`)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data;
  }

  static subscribeToPulse(callback: (pulse: number) => void) {
    const checkPulse = () => {
      callback(this.getCurrentPulse());
    };

    checkPulse();

    const interval = setInterval(() => {
      checkPulse();
    }, this.PULSE_INTERVAL);

    return () => clearInterval(interval);
  }
}
