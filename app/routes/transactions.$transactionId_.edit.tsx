import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { useMemo, useRef } from 'react';
import invariant from 'tiny-invariant';
import TransactionCreateForm from '~/components/TransactionCreateForm';
import { getTransactionById, updateTransaction } from '~/server/transactions.server';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.transactionId, 'No transactionId provided');

  const transaction = await getTransactionById(params.transactionId);

  return json({ transaction });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const id = params.transactionId as string;
  const description = formData.get('description') as string;
  const date = new Date(formData.get('date') as string);
  const amount = parseFloat(formData.get('amount') as string);

  await updateTransaction(id, description, date, amount);

  return redirect('/');
};

export default function EditTransaction() {
  const descriptionRef = useRef<HTMLInputElement>(null);

  const { transaction } = useLoaderData<typeof loader>();

  // The date input requires a string in the format "YYYY-MM-DD"
  // So we format the date to match that format
  const formattedDate = useMemo(() => {
    if (!transaction) return '';

    const date = new Date(transaction.date);
    return date.toISOString().split('T')[0];
  }, []);

  return (
    <div className="max-w-3xl p-10">
      <h1 className="font-bold text-3xl text-emerald-900">Update transaction</h1>

      <Form
        method="POST"
        className="grid grid-cols-8 gap-x-3 gap-y-5 mt-10"
      >
        <div className="col-span-8">
          <label htmlFor="description" className="block text-sm font-medium leading-6">
            Description
          </label>

          <div className="mt-2">
            <input
              required
              ref={descriptionRef}
              type="text"
              name="description"
              defaultValue={transaction?.description}
              className="rounded w-full focus:ring-emerald-500 focus:ring-2 focus:border-white"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="description" className="block text-sm font-medium leading-6">
            Date
          </label>

          <div className="mt-2">
            <input
              required
              type="date"
              placeholder="Date"
              name="date"
              defaultValue={formattedDate}
              className="rounded w-full focus:ring-emerald-500 focus:ring-2 focus:border-white"
            />
          </div>
        </div>

        <div className="col-span-3">
          <label htmlFor="description" className="block text-sm font-medium leading-6">
            Amount *
          </label>

          <div className="mt-2">
            <input
              required
              type="text"
              name="amount"
              // Using type="number" is problematic in some browsers because it does not allow for negative numbers / decimals
              // Using pattern to enforce a number with optional negative sign and decimal
              pattern="^[\-+]?[0-9]*.?[0-9]+$"
              defaultValue={transaction?.amount.toString()}
              className="rounded w-full text-right focus:ring-emerald-500 focus:ring-2 focus:border-white"
            />
          </div>
        </div>

        <div className="col-span-2 flex items-end">
          <button
            type="submit"
            name="_action"
            value="create"
            className="rounded-md bg-emerald-400 w-full h-[42px] py-2.5 text-sm font-semibold text-emerald-900 shadow-sm hover:bg-emerald-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 transition ease-in-out"
          >
            Edit
          </button>
        </div>

        <div className="col-span-8 text-sm text-gray-400 border-t pt-3">
          * Use a dot (.) as the decimal separator. Positive (income) and negative (expense) amounts are both allowed.
        </div>
      </Form>

    </div>
  );
}
