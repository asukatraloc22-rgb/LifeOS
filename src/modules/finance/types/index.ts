export type TransactionType = 'revenu' | 'depense';

export interface Transaction {
  id: number;
  type: TransactionType;
  desc: string;
  montant: number;
  cat: string;
  date: string;
}

export interface FinancialGoal {
  id: number;
  name: string;
  target: number;
  current: number;
}
