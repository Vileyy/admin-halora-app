import { database } from "./firebase";
import { ref, get } from "firebase/database";

export interface Brand {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
}

export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    const brandsRef = ref(database, "brands");
    const snapshot = await get(brandsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const brands: Brand[] = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      return brands;
    }
    return [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};
