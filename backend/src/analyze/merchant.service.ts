import { Injectable } from '@nestjs/common';
import { TransactionDto } from './dtos/transaction.dto';


interface LocalMerchant {
  name: string;
  keywords: string[];          // synonyms or key tokens
  category: string;
  subCategory: string;
  confidence: number;          // base confidence
  isSubscription: boolean;
  flags: string[];
}
const MERCHANTS_DB: LocalMerchant[] = [
  {
    name: 'Amazon',
    keywords: ['amazon', 'amzn', 'amzn mk', 'amzn mktp'],
    category: 'Shopping',
    subCategory: 'Online Retail',
    confidence: 0.95,
    isSubscription: false,
    flags: ['online_purchase', 'marketplace'],
  },
  {
    name: 'Netflix',
    keywords: ['netflix', 'nflx'],
    category: 'Entertainment',
    subCategory: 'Streaming Service',
    confidence: 0.98,
    isSubscription: true,
    flags: ['subscription', 'digital_service'],
  },
  {
    name: 'Starbucks',
    keywords: ['starbucks', 'strbcks'],
    category: 'Food & Beverage',
    subCategory: 'Coffee Shop',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'Spotify',
    keywords: ['spotify'],
    category: 'Entertainment',
    subCategory: 'Music Streaming',
    confidence: 0.9,
    isSubscription: true,
    flags: ['subscription', 'digital_service'],
  },
  {
    name: 'Uber',
    keywords: ['uber', 'uber trip', 'uber*'],
    category: 'Transportation',
    subCategory: 'Rideshare',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'Lyft',
    keywords: ['lyft', 'lyft trip'],
    category: 'Transportation',
    subCategory: 'Rideshare',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'Apple',
    keywords: ['apple.com/bill', 'apple.com', 'apple'],
    category: 'Technology',
    subCategory: 'Digital Services',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'YouTube Premium',
    keywords: ['youtube premium', 'youtube subs', 'yt premium'],
    category: 'Entertainment',
    subCategory: 'Streaming Service',
    confidence: 0.95,
    isSubscription: true,
    flags: ['subscription', 'digital_service'],
  },
  {
    name: 'Disney+',
    keywords: ['disney+', 'disney plus'],
    category: 'Entertainment',
    subCategory: 'Streaming Service',
    confidence: 0.95,
    isSubscription: true,
    flags: ['subscription', 'digital_service'],
  },
  {
    name: 'Hulu',
    keywords: ['hulu'],
    category: 'Entertainment',
    subCategory: 'Streaming Service',
    confidence: 0.95,
    isSubscription: true,
    flags: ['subscription', 'digital_service'],
  },
  {
    name: 'HBO Max',
    keywords: ['hbo max', 'hbo', 'hbomax'],
    category: 'Entertainment',
    subCategory: 'Streaming Service',
    confidence: 0.95,
    isSubscription: true,
    flags: ['subscription', 'digital_service'],
  },
  {
    name: 'Walmart',
    keywords: ['walmart', 'wal-mart', 'wm store'],
    category: 'Retail',
    subCategory: 'General Merchandise',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'Target',
    keywords: ['target', 'tgt store'],
    category: 'Retail',
    subCategory: 'General Merchandise',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'Costco',
    keywords: ['costco', 'cost co'],
    category: 'Retail',
    subCategory: 'Wholesale Store',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'Best Buy',
    keywords: ['bestbuy', 'best buy', 'bst buy'],
    category: 'Shopping',
    subCategory: 'Electronics',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'McDonald\'s',
    keywords: ['mcdonalds', 'mcdonald', 'mc donald', 'mc donalds'],
    category: 'Food & Beverage',
    subCategory: 'Fast Food',
    confidence: 0.85,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'Burger King',
    keywords: ['burger king', 'brgr king', 'bk whopper'],
    category: 'Food & Beverage',
    subCategory: 'Fast Food',
    confidence: 0.85,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'Shell',
    keywords: ['shell', 'shell oil'],
    category: 'Transportation',
    subCategory: 'Gas Station',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'Exxon',
    keywords: ['exxon', 'exxonmobil', 'exxon mobil'],
    category: 'Transportation',
    subCategory: 'Gas Station',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'DoorDash',
    keywords: ['doordash', 'door dash'],
    category: 'Food Delivery',
    subCategory: 'Restaurant Delivery',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'Grubhub',
    keywords: ['grubhub', 'grub hub'],
    category: 'Food Delivery',
    subCategory: 'Restaurant Delivery',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'Instacart',
    keywords: ['instacart'],
    category: 'Food Delivery',
    subCategory: 'Grocery Delivery',
    confidence: 0.9,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'CVS',
    keywords: ['cvs pharmacy', 'cvs store'],
    category: 'Health & Wellness',
    subCategory: 'Pharmacy',
    confidence: 0.85,
    isSubscription: false,
    flags: [],
  },
  {
    name: 'Walgreens',
    keywords: ['walgreens', 'wal greens'],
    category: 'Health & Wellness',
    subCategory: 'Pharmacy',
    confidence: 0.85,
    isSubscription: false,
    flags: [],
  },
];

export default MERCHANTS_DB;


@Injectable()
export class LocalMerchantService {
  private merchantVectors: {
    [merchantName: string]: number[];
  } = {};

  private vocabulary: string[] = [];

  constructor() {
    // Build a global vocabulary from all merchant keywords
    const vocabSet = new Set<string>();
    for (const merchant of MERCHANTS_DB) {
      merchant.keywords.forEach((kw) => {
        this.tokenize(kw).forEach((token) => vocabSet.add(token));
      });
    }
    this.vocabulary = Array.from(vocabSet);

    // Build reference vectors
    for (const merchant of MERCHANTS_DB) {
      this.merchantVectors[merchant.name] = this.buildVector(merchant.keywords);
    }
  }

  normalizeTransaction(transaction: TransactionDto) {
    const desc = (transaction.description || '').toLowerCase().trim();
    if (!desc) {
      return this.unknownResult(transaction.amount);
    }

    // Build a vector for the incoming transaction
    const txVector = this.buildVector([desc]);

    // Compare with known merchants
    let bestMatch: LocalMerchant | null = null;
    let bestScore = -1;

    for (const merchant of MERCHANTS_DB) {
      const merchVector = this.merchantVectors[merchant.name];
      const sim = this.cosineSimilarity(txVector, merchVector);

      if (sim > bestScore) {
        bestScore = sim;
        bestMatch = merchant;
      }
    }

    // Threshold to accept
    const THRESHOLD = 0.6;
    if (bestMatch && bestScore >= THRESHOLD) {
      return {
        merchant: bestMatch.name,
        category: bestMatch.category,
        sub_category: bestMatch.subCategory,
        confidence: bestMatch.confidence * bestScore,
        is_subscription: bestMatch.isSubscription,
        flags: bestMatch.flags,
        amount: transaction.amount,
      };
    }

    return this.unknownResult(transaction.amount);
  }

  private unknownResult(amount: number) {
    return {
      merchant: 'Unknown',
      category: 'Uncategorized',
      sub_category: 'N/A',
      confidence: 0.8,
      is_subscription: false,
      flags: [] as string[],
      amount,
    };
  }

  private buildVector(texts: string[]): number[] {
    // Initialize zero vector
    const vector = Array(this.vocabulary.length).fill(0);

    for (const txt of texts) {
      const tokens = this.tokenize(txt);
      for (const t of tokens) {
        const idx = this.vocabulary.indexOf(t);
        if (idx >= 0) {
          vector[idx] += 1;
        }
      }
    }
    return vector;
  }

  private tokenize(text: string): string[] {
    // Very naive tokenizer: split on non-alphanumeric
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter(Boolean);
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;

    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
