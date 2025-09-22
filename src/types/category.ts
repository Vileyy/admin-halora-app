export interface Category {
  id: string;
  title: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryData {
  title: string;
  image: string;
}

export interface UpdateCategoryData {
  title?: string;
  image?: string;
}
