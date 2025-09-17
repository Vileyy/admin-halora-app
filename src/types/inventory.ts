export interface Media {
  id: string;
  url: string;
  type: string;
  order: number;
}

export interface Variant {
  id: string;
  name: string;
  importPrice: number;
  price: number;
  stockQty: number;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  supplier: string;
  brandId: string;
  media: Media[];
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
}
