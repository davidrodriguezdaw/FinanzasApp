
export enum MarketSentiment {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL'
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  asset: string;
  sentiment?: MarketSentiment;
  confidence?: number;
  impact?: string;
  analyzed: boolean;
  // Campos de traducción
  translatedTitle?: string;
  translatedSummary?: string;
  translatedImpact?: string;
  isSpanish?: boolean;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  icon: string;
}

export interface SubAllocation {
  name: string;
  percentage: number;
}

export interface UserPortfolio {
  balance: number;
  totalProfit: number;
  allocations: {
    savings: number;
    indexFunds: {
      total: number;
      subs: SubAllocation[];
    };
    crypto: {
      total: number;
      subs: SubAllocation[];
    };
  };
  holdings: {
    symbol: string;
    amount: number;
    value: number;
  }[];
}

export enum Page {
  DASHBOARD = 'DASHBOARD',
  NEWS = 'NEWS',
  SPLITTER = 'SPLITTER',
  PORTFOLIO = 'PORTFOLIO',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER'
}
