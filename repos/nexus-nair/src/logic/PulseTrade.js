/**
 * 9s PulseTrade™ - High-frequency trading logic
 * 9-second pulse cycle for real-time brand transactions
 */

export class PulseTrade {
  constructor(gorillaCodex) {
    this.codex = gorillaCodex;
    this.pulseInterval = 9000; // 9 seconds
    this.activePulses = new Map();
    this.tradeHistory = [];
  }

  startPulse(pulseId, callback) {
    if (this.activePulses.has(pulseId)) {
      throw new Error(`Pulse ${pulseId} already active`);
    }

    const interval = setInterval(() => {
      const pulse = {
        id: pulseId,
        timestamp: Date.now(),
        cycle: this.activePulses.get(pulseId).cycles++,
        status: 'ACTIVE'
      };
      
      callback(pulse);
    }, this.pulseInterval);

    this.activePulses.set(pulseId, {
      interval,
      startTime: Date.now(),
      cycles: 0
    });

    return pulseId;
  }

  stopPulse(pulseId) {
    const pulse = this.activePulses.get(pulseId);
    if (pulse) {
      clearInterval(pulse.interval);
      this.activePulses.delete(pulseId);
      return true;
    }
    return false;
  }

  executeTrade(tradeData) {
    const trade = {
      id: `TRADE_${Date.now()}`,
      timestamp: Date.now(),
      ...tradeData,
      status: 'EXECUTED'
    };

    this.tradeHistory.push(trade);
    
    // Process through Gorilla Codex
    if (tradeData.type === 'BRAND_TRANSACTION') {
      this.codex.processTransaction({
        type: 'ADD_BRAND',
        data: tradeData.brandData
      });
    }

    return trade;
  }

  getActivePulses() {
    return Array.from(this.activePulses.keys());
  }

  getTradeHistory(limit = 100) {
    return this.tradeHistory.slice(-limit);
  }

  getPulseStats() {
    const stats = {};
    this.activePulses.forEach((pulse, id) => {
      stats[id] = {
        cycles: pulse.cycles,
        uptime: Date.now() - pulse.startTime,
        status: 'ACTIVE'
      };
    });
    return stats;
  }
}

export default PulseTrade;
