export type Client = {
  id: string;
  name: string;
  phone: string;
  store_id: string;
  order_items:OrderItem[];
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  count: number;
  discount: number; 
  product:Product;
  price: number; 
  product_id: string;
  order_id: string;

};
export type Product = {
  id: string;
  name: string;
  quantity: number;
  reminder_quantity: number;
  usd_rate: number;
  clientName?:string;
  created_at?: string;
  updated_at?: string;
};

export type Payment = {
  id: string;
  price: number; 
  payment_type_id: string; 
  order_id: string;
  store_id: string;
  created_at?: string;
};

export type Order = {
  id: string;
  order_number: number;
  store_id: string;
  client_id: string;
  total_price: number;
  created_at: string;
  updated_at: string;

  client: Client;
  order_items: OrderItem[];
  payments: Payment[];
  debts: any[];
};
