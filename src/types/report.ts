export type StockReport = {
  id: string;
  storeId: string;
  reporterName?: string;
  productNote: string;
  inStock: boolean;
  confidence: number;
  reportedAt: string;
};
