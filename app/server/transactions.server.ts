import type { Transaction } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { id } from 'postcss-selector-parser';

const prisma = new PrismaClient();

export interface TransactionWithSubtotal extends Transaction {
  subtotal: number;
}

export interface TransactionSubtotalOverTime {
  date: Date;
  subtotal: number;
}

/**
 * Get all transactions and calculate the subtotal for each transaction
 * The subtotal is the sum of all previous transaction amounts plus the current transaction amount
 */
export const getTransactionsWithSubtotal = async (): Promise<Array<TransactionWithSubtotal>> => {
  const transactions = await prisma.transaction.findMany({
    orderBy: [
      { date: 'asc' },
      { createdAt: 'asc' },
    ],
  });

  // No need to calculate the subtotal if there are no transactions
  if (!transactions?.length) {
    return [];
  }

  // Add the subtotal to each transaction
  let subtotal = 0;
  return transactions.map((transaction) => {
    subtotal += transaction.amount;

    return {
      ...transaction,
      subtotal: subtotal,
    };
  });
};

/**
 * Query the database for all transactions, grouped by date, and calculate the subtotal for each date
 * This is for the graph that shows the subtotal over time
 */
export const getTransactionSubtotalOverTime = async (): Promise<Array<TransactionSubtotalOverTime>> => {
  const transactions = await prisma.transaction.groupBy({
    by: ['date'],
    _sum: { amount: true },
    orderBy: [{ date: 'asc' }],
  });

  // Clean up the data and calculate the subtotal for each date
  let subtotal = 0;
  return transactions.map((transaction) => {
    subtotal += transaction._sum.amount || 0;

    return ({
      date: transaction.date,
      subtotal,
    });
  });
};

export const getTransactionById = async (
  id: Transaction['id'],
): Promise<Transaction | null> => {
  return prisma.transaction.findUnique({
    where: { id },
  });
};

export const createTransaction = async (
  description: Transaction['description'],
  date: Transaction['date'],
  amount: Transaction['amount'],
): Promise<Transaction> => {
  return prisma.transaction.create({
    data: {
      description,
      date: date.toISOString(),
      amount,
    },
  });
};

export const updateTransaction = async (
  id: Transaction['id'],
  description: Transaction['description'],
  date: Transaction['date'],
  amount: Transaction['amount'],
): Promise<Transaction> => {
  return prisma.transaction.update({
    where: { id },
    data: {
      description,
      date: date.toISOString(),
      amount,
    },
  });
};

export const deleteTransaction = async(
  id: Transaction['id'],
): Promise<Transaction> => {
  return prisma.transaction.delete({
    where: { id },
  });
};
