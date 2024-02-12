import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import { SerializeFrom } from '@remix-run/node';
import { Link, useFetcher } from '@remix-run/react';
import classNames from 'classnames';
import { TransactionWithSubtotal } from '~/server/transactions.server';
import { currencyFormatter, dateFormatter } from '~/utils';

interface TransactionsListProps {
  transactions: SerializeFrom<Array<TransactionWithSubtotal>>;
}

export default function TransactionsList ({ transactions }: TransactionsListProps) {
  const fetcher = useFetcher();

  // Deal with no transactions
  if (transactions.length === 0) {
    return (
      <div>
        <h1 className="font-bold text-3xl text-emerald-900 mb-3">No transactions found</h1>
        <p className="text-gray-500">You can add a new transaction using the form below.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-bold text-3xl text-emerald-900">Transactions</h1>

      <div className="mt-10 ring-1 ring-gray-300 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 table-fixed">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900"
              >
                Description
              </th>

              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 table-cell"
              >
                Date
              </th>

              <th
                scope="col"
                className="px-3 py-3.5 text-sm font-semibold text-gray-900 table-cell text-right"
              >
                Amount
              </th>

              <th
                scope="col"
                className="px-3 py-3.5 text-sm font-semibold text-gray-900 table-cell text-right"
              >
                Subtotal
              </th>

              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Select</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction, transactionIdx: number) => (
              <tr key={transaction.id}>
                <td
                  className={classNames(
                    transactionIdx === 0? '' : 'border-t border-gray-200',
                    'relative py-4 pl-6 pr-3 text-sm',
                  )}
                >
                  <div className="font-medium text-emerald-900">
                    {transaction.description}
                  </div>
                </td>

                <td
                  className={classNames(
                    transactionIdx === 0? '' : 'border-t border-gray-200',
                    'px-3 py-3.5 text-sm text-gray-500',
                  )}
                >
                  {dateFormatter(transaction.date)}
                </td>

                <td
                  className={classNames(
                    transactionIdx === 0? '' : 'border-t border-gray-200',
                    transaction.amount < 0? 'text-red-500' : 'text-emerald-500',
                    'px-3 py-3.5 text-sm text-gray-500 text-right',
                  )}
                >
                  {currencyFormatter(transaction.amount)}
                </td>

                <td
                  className={classNames(
                    transactionIdx === 0? '' : 'border-t border-gray-200',
                    transaction.subtotal < 0? 'text-red-500' : 'text-emerald-500',
                    'px-3 py-3.5 text-sm text-right font-bold',
                  )}
                >
                  {currencyFormatter(transaction.subtotal)}
                </td>

                <td
                  className={classNames(
                    transactionIdx === 0? '' : 'border-t border-gray-200',
                    'relative py-3.5 pl-3 pr-6 text-right text-sm',
                  )}
                >
                  <span className="isolate inline-flex rounded-md shadow-sm">
                    <Link
                      to={`/transactions/${transaction.id}/edit`}
                      className="relative -ml-px inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                    >
                      <PencilSquareIcon className="h-4 w-4" aria-hidden="true" />
                    </Link>

                    <fetcher.Form method="POST">
                      <input type="hidden" name="id" value={transaction.id} />
                      <button
                        type="submit"
                        name="_action"
                        value="delete"
                        className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                        onClick={(e) => {
                          if (!confirm('Are you sure you want to delete this transaction?')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </fetcher.Form>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
