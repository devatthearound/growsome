export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  category: string;
  features: string[];
  installment?: {
    months: number;
    monthlyPayment: number;
  };
}

export interface ProductData {
  [key: string]: Product;
}

export function getProductData(id: string): Product | null; 