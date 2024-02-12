import { ActionFunctionArgs, json, MetaFunction, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import TransactionCreateForm from '~/components/TransactionCreateForm';
import TransactionsList from '~/components/TransactionsList';
import TransactionSubtotalGraph from '~/components/TransactionSubtotalGraph';
import {
  createTransaction,
  deleteTransaction,
  getTransactionSubtotalOverTime,
  getTransactionsWithSubtotal,
} from '~/server/transactions.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Transactions' },
    { name: 'description', content: 'Overview of transactions' },
  ];
};

export async function loader () {
  const transactions = await getTransactionsWithSubtotal();
  const transactionsGroupedByDate = await getTransactionSubtotalOverTime();

  return json({
    transactions,
    transactionsGroupedByDate,
  });
}

export async function action ({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // Check if we are deleting or creating a transaction
  const action = formData.get('_action') as string;
  if (action === 'delete') {
    const id = formData.get('id') as string;
    return deleteTransaction(id);
  }

  // We are creating a transaction
  const description = formData.get('description') as string;
  const date = new Date(formData.get('date') as string);
  const amount = parseFloat(formData.get('amount') as string);

  await createTransaction(description, date, amount);

  // TODO: Is this necessary after switching to `fetcher.Form`?
  return redirect(`/`);
}

export default function Index () {
  const { transactions, transactionsGroupedByDate } = useLoaderData<typeof loader>();

  // It does not make sense to show a graph when we have 0 or 1 transactions
  const showGraph = transactions.length > 1;

  return (
    <div className="grid grid-cols-2 gap-10 p-10">
      <div className="col-span-2 pb-10 border-b">
        <TransactionsList transactions={transactions} />
      </div>

      <div className="border-r pr-10">
        <TransactionCreateForm />
      </div>

      {showGraph && <TransactionSubtotalGraph transactions={transactionsGroupedByDate} />}
    </div>
  );
}
