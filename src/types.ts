export interface PriceItem {
  id: number;
  category: string;
  brand: string;
  variant: string;
  size: string;
  srp: number;
  lastUpdated: string;
}

export interface Category {
  name: string;
  icon: string;
}
