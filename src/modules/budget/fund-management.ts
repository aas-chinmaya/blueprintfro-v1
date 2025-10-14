export interface Entity {
  id: string;
  name: string;
  amount: number;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  entities: Entity[];
}

export interface BudgetRequest {
  id: string;
  title: string;
  description: string;
  requestedAmount: number;
  currency: 'INR' | 'USD';
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedBy: string;
  date: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'Add Fund' | 'Spend' | 'Allocate';
  status: 'Success' | 'Failed';
  method: 'UPI' | 'Card' | 'Net Banking' | 'Wallet' | 'Bank Transfer';
  payee: string;
  category?: string;
  date: string;
  time: string;
}

export interface FundManagementState {
  mainAccount: number;
  categories: Category[];
  budgetRequests: BudgetRequest[];
  transactions: Transaction[];
}
