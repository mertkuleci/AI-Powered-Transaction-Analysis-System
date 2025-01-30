import { Injectable } from '@nestjs/common';
import { LocalMerchantService } from './merchant.service';
import { PatternService } from './pattern.service';
import { TransactionDto } from './dtos/transaction.dto';
import { DetectedPattern } from './dtos/pattern.dto';

@Injectable()
export class AnalyzeService {
  constructor(
    private readonly localMerchantService: LocalMerchantService,
    private readonly patternService: PatternService
  ) {}

  // Single transaction
  normalizeMerchant(transaction: TransactionDto) {
    return this.localMerchantService.normalizeTransaction(transaction);
  }

  // Patterns
  detectPatterns(transactions: TransactionDto[]): DetectedPattern[] {
    return this.patternService.detectPatterns(transactions);
  }

  // Combined analysis
  analyzeTransactions(transactions: TransactionDto[]) {
    const normalizedList = transactions.map((tx) => ({
      original: tx.description,
      normalized: this.localMerchantService.normalizeTransaction(tx),
    }));

    const patterns = this.patternService.detectPatterns(transactions);

    return {
      normalized_transactions: normalizedList,
      detected_patterns: patterns,
    };
  }
}
