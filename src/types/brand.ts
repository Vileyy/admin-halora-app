export interface Brand {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBrandData {
  name: string;
  description: string;
  logoUrl: string;
}

export interface UpdateBrandData {
  name?: string;
  description?: string;
  logoUrl?: string;
}
