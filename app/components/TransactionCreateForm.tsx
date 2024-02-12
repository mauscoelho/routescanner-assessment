import { useFetcher } from '@remix-run/react';
import { useEffect, useRef } from 'react';

export default function TransactionCreateForm() {
  const fetcher = useFetcher();

  const formRef = useRef<HTMLFormElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const isCreating =
    fetcher.state === 'submitting' &&
    fetcher.formData?.get('_action') === 'create';

  // After creating a transaction, we clear the inputs & focus back to the description field
  useEffect(() => {
    if (!isCreating) {
      formRef.current?.reset();
      descriptionRef.current?.focus();
    }
  }, [isCreating]);

  return (
    <div>
      <h2 className="font-bold text-xl text-emerald-900">Add a transaction</h2>

      <div className="mt-4">
        <fetcher.Form
          ref={formRef}
          method="POST"
          className="grid grid-cols-8 gap-x-3 gap-y-5"
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
              Save
            </button>
          </div>

          <div className="col-span-8 text-sm text-gray-400 border-t pt-3">
            * Use a dot (.) as the decimal separator. Positive (income) and negative (expense) amounts are both allowed.
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
