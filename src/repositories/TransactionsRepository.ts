import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions.reduce((prev, transaction) => {
      return transaction.type === 'income' ? prev + transaction.value : prev;
    }, 0);
    const totalIncomeAndOutcome = this.transactions.reduce(
      (prev, transaction) => prev + transaction.value,
      0,
    );
    const balance = {
      income,
      outcome: totalIncomeAndOutcome - income,
      total: 2 * income - totalIncomeAndOutcome,
    };
    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const balance = this.getBalance();
    if (type === 'outcome' && balance.total - value < 0) {
      throw Error('Saldo insuficiente!');
    }

    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
