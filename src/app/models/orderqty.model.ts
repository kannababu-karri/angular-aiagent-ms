export interface Orderqty {
  orderId: number;
  user?: User;            
  manufacturer?: Manufacturer;
  product?: Product;
  quantity: number;
  status: string;
  documentType: string;
}

export interface User {
  userId: number;
  userName?: string;
  role?: string;
}

export interface Manufacturer {
  manufacturerId: number;
  mfgName?: string;
}

export interface Product {
  productId: number;
  productName?: string;
  productDescription?: string;
  casNumber?: string;
}
