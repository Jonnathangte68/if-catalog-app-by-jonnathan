import axios from 'axios';
import { Product } from '@/types/Product';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await axios.get<Product[]>(`${API_URL}/products`);
  return res.data;
};
