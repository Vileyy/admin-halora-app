export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CreateBannerData {
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

export interface UpdateBannerData {
  title?: string;
  imageUrl?: string;
  linkUrl?: string;
  isActive?: boolean;
}
