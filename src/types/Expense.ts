export interface Expense {
  _id?: string;
  id?: string;
  user_id?: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}
