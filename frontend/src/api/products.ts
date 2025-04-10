import axios from 'axios';
import { Product } from '../types/Product';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchProducts(): Promise<Product[]> {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
}