
export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface TradeSignal {
  type: 'Buy' | 'Sell';
  entryPrice: string;
  stopLoss: string;
  takeProfit: string;
  riskReward: string;
  reasoning: string;
  confirmation: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface UserSubscription {
  email: string;
  isPaid: boolean;
  isPending: boolean; // Kwa ajili ya uhakiki wa admin
  expiryDate?: string;
  plan: 'Monthly' | 'Yearly' | 'Lifetime' | 'None';
  isAdmin?: boolean;
}

export interface ForexAnalysis {
  pair: string;
  timeframe: string;
  marketStructure: string;
  supportResistance: string[];
  trendDirection: string;
  trendStrength: string;
  supplyDemandZones: string[];
  liquidityClusters: string[];
  primarySignal: TradeSignal;
  alternativeScenario: string;
  summary: string;
  mockChartData: CandleData[];
  groundingSources?: GroundingSource[];
}

export type TimeFrame = '1M' | '5M' | '15M' | '1H' | '4H' | '1D' | '1W';
