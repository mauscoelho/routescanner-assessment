import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { action } from "~/routes/_index";

export default function TransactionCreateForm() {
  const fetcher = useFetcher<typeof action>();

  const formRef = useRef<HTMLFormElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  // If the action returns a successful response, reset the form and focus the description input
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      formRef.current?.reset();
      descriptionRef.current?.focus();
    }
  }, [fetcher.state, fetcher.data?.ok]);

  return (
    <div>
      <h2 className="text-xl font-bold text-emerald-900">Add a transaction</h2>

      <div className="mt-4">
        <fetcher.Form
          ref={formRef}
          method="POST"
          className="grid grid-cols-8 gap-x-3 gap-y-5"
        >
          <div className="col-span-8">
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-6"
            >
              Description
            </label>

            <div className="mt-2">
              <input
                required
                ref={descriptionRef}
                type="text"
                name="description"
                className="w-full rounded focus:border-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="col-span-3">
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-6"
            >
              Date
            </label>

            <div className="mt-2">
              <input
                required
                type="date"
                placeholder="Date"
                name="date"
                className="w-full rounded focus:border-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="col-span-3">
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-6"
            >
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
                className="w-full rounded text-right focus:border-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="col-span-2 flex items-end">
            <button
              type="submit"
              name="_action"
              value="create"
              className="h-[42px] w-full rounded-md bg-emerald-400 py-2.5 text-sm font-semibold text-emerald-900 shadow-sm transition ease-in-out hover:bg-emerald-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
            >
              Save
            </button>
          </div>

          <div className="col-span-8 border-t pt-3 text-sm text-gray-400">
            * Use a dot (.) as the decimal separator. Positive (income) and
            negative (expense) amounts are both allowed.
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
