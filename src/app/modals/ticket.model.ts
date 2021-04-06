export interface Ticket {
  id: string;
  title: string;
  content: string;
  status: boolean;
  price: number;
  percent: number;
  category: string;
  categoryService: string;
  price_reduce: number;
  city: string;
  quantity: number;
  imagePath: Array<string>;
  address: string;
  services: Array<object>;
}
