export interface DetectedPattern {
  type: string;      // e.g. "subscription", "recurring"
  merchant: string;
  amount: number;
  frequency?: string;  // e.g. "monthly", "weekly"
  confidence: number;
  next_expected?: string;
  notes?: string;
}
