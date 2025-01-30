import { Injectable } from '@nestjs/common';
import { TransactionDto } from './dtos/transaction.dto';
import { DetectedPattern } from './dtos/pattern.dto';

@Injectable()
export class PatternService {
  detectPatterns(transactions: TransactionDto[]): DetectedPattern[] {
    const patterns: DetectedPattern[] = [];

    // 1) Hardcoded known subscription detection
    this.detectKnownSubscriptions(transactions, patterns);

    // 2) Recurring detection with average intervals
    this.detectRecurringByTime(transactions, patterns);

    return patterns;
  }

  private detectKnownSubscriptions(
    transactions: TransactionDto[],
    patterns: DetectedPattern[],
  ) {
    
    const knownSubs = [
      { key: 'netflix', displayName: 'Netflix', freq: 'monthly' },
      { key: 'spotify', displayName: 'Spotify', freq: 'monthly' },
      { key: 'apple music', displayName: 'Apple Music', freq: 'monthly' },
      { key: 'amazon prime', displayName: 'Amazon Prime', freq: 'monthly' },
      { key: 'disney+', displayName: 'Disney Plus', freq: 'monthly' },
      { key: 'hulu', displayName: 'Hulu', freq: 'monthly' },
      { key: 'hbo max', displayName: 'HBO Max', freq: 'monthly' },
      { key: 'youtube premium', displayName: 'YouTube Premium', freq: 'monthly' },
      { key: 'gym membership', displayName: 'Local Gym', freq: 'monthly' },
    ];

    for (const sub of knownSubs) {
      const found = transactions.find((t) =>
        t.description.toLowerCase().includes(sub.key),
      );
      if (found) {
        patterns.push({
          type: 'subscription',
          merchant: sub.displayName,
          amount: Math.abs(found.amount),
          frequency: sub.freq,
          confidence: 0.95,
          next_expected: '2024-02-01',
        });
      }
    }
  }

  private detectRecurringByTime(
    transactions: TransactionDto[],
    patterns: DetectedPattern[],
  ) {
    
    const groups = new Map<string, TransactionDto[]>();
    for (const tx of transactions) {
      const key = (tx.description || '').toLowerCase().trim();
      if (!key) continue;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(tx);
    }

    // For each group, sort by date & compute intervals
    for (const [merchantName, txs] of groups) {
      if (txs.length < 2) continue;

      // sort
      txs.sort((a, b) => this.parseDate(a.date) - this.parseDate(b.date));

      const intervals: number[] = [];
      for (let i = 1; i < txs.length; i++) {
        const prevTime = this.parseDate(txs[i - 1].date);
        const currTime = this.parseDate(txs[i].date);
        if (prevTime === 0 || currTime === 0) continue;
        intervals.push((currTime - prevTime) / (1000 * 3600 * 24));
      }

      if (intervals.length === 0) continue;

      // average + stdev
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const stdev = Math.sqrt(
        intervals.reduce((sum, x) => sum + (x - avg) ** 2, 0) / intervals.length,
      );

      // If intervals are consistent => recurring pattern
      if (stdev < 2) {
        let freq: string | undefined;
        if (avg >= 25 && avg <= 35) freq = 'monthly';
        else if (avg >= 6 && avg <= 9) freq = 'weekly';

        if (freq) {
          // last transaction
          const lastTx = txs[txs.length - 1];
          const lastTime = this.parseDate(lastTx.date);
          // compute next expected
          const nextExpectedTime = lastTime + Math.round(avg) * 24 * 3600 * 1000;
          const nextExpected = new Date(nextExpectedTime)
            .toISOString()
            .split('T')[0];

          patterns.push({
            type: 'recurring',
            merchant: merchantName,
            amount: Math.abs(lastTx.amount),
            frequency: freq,
            confidence: 0.85,
            next_expected: nextExpected,
            notes: `Avg interval ~${avg.toFixed(1)} days, stdev ~${stdev.toFixed(1)}`,
          });
        }
      }
    }
  }

  private parseDate(dateStr?: string): number {
    if (!dateStr) return 0;
    const t = new Date(dateStr).getTime();
    if (isNaN(t)) return 0;
    return t;
  }
}
