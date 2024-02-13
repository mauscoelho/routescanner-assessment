import {
  ActionFunctionArgs,
  json,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import TransactionCreateForm from "~/components/TransactionCreateForm";
import TransactionsList from "~/components/TransactionsList";
import TransactionSubtotalGraph from "~/components/TransactionSubtotalGraph";
import {
  createTransaction,
  deleteTransaction,
  getTransactionSubtotalOverTime,
  getTransactionsWithSubtotal,
} from "~/server/transactions.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Transactions" },
    { name: "description", content: "Overview of transactions" },
  ];
};

export async function loader() {
  const transactions = await getTransactionsWithSubtotal();
  const transactionsGroupedByDate = await getTransactionSubtotalOverTime();

  return json({
    transactions,
    transactionsGroupedByDate,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // Check if we are deleting or creating a transaction
  const action = formData.get("_action") as string;
  if (action === "delete") {
    const id = formData.get("id") as string;
    await deleteTransaction(id);
    return { ok: true };
  }

  // We are creating a transaction
  const description = formData.get("description") as string;
  const date = new Date(formData.get("date") as string);
  const amount = parseFloat(formData.get("amount") as string);

  await createTransaction(description, date, amount);

  // Redirect is not needed here because we are using the loader to refresh the data, Remix takes care of that for us automatically
  // We can return the ok: true to indicate that the action was successful
  // We could also return the new transaction, but we don't need it here
  // We could also return ok: false and an error message if something went wrong making a validation on the server side
  return { ok: true };
}

export default function Index() {
  const { transactions, transactionsGroupedByDate } =
    useLoaderData<typeof loader>();

  // It does not make sense to show a graph when we have 0 or 1 transactions
  const showGraph = transactions.length > 1;

  return (
    <div className="grid grid-cols-2 gap-10 p-10">
      <div className="col-span-2 border-b pb-10">
        <TransactionsList transactions={transactions} />
      </div>

      <div className="border-r pr-10">
        <TransactionCreateForm />
      </div>

      {showGraph && (
        <TransactionSubtotalGraph transactions={transactionsGroupedByDate} />
      )}
    </div>
  );
}
