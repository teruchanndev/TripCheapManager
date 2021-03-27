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
  imagePath: string
}
