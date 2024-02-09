import { PrismaClient, Transaction } from '@prisma/client';

const prisma = new PrismaClient();

export interface TransactionWithSubtotal extends Transaction {
  subtotal: number;
}

/**
 * Get all transactions
 */
export const getTransactions = async(): Promise<Array<Transaction>> => {
  return prisma.transaction.findMany({ orderBy: { date: 'desc' } });
};

/**
 * Get all transactions and calculate the subtotal for each transaction
 * The subtotal is the sum of all previous transaction amounts plus the current transaction amount
 * Normally this would already be calculated in the API, but for the sake of the exercise we will calculate it here
 */
export const getTransactionsWithSubtotal = async (): Promise<Array<TransactionWithSubtotal>> => {
  const transactions = await getTransactions();

  // No need to calculate the subtotal if there are no transactions
  if (!transactions?.length) {
    return [];
  }

  // We need to add the current transaction amount to the previous subtotal
  const initialSubtotal: number = transactions[0].amount;

  return transactions.map((transaction, index) => {
    // Set the subtotal for the first transaction, otherwise add the current amount to the previous subtotal
    const subtotal = index === 0
      ? initialSubtotal
      : transactions[index - 1].amount + transaction.amount;

    return { ...transaction, subtotal };
  });
};
