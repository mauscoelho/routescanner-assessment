# RouteScanner – Assessment

## Instructions:
1. `npm install`
2. `npx prisma generate` in case you want to generate the Prisma types
3. `npm run dev`

## Notes
1. I used Prisma with SQLite as the database for this demo. To make it easier to run the project, I included the SQLite database file in the repository. The database file is located at `prisma/dev.db`. Obviously, in a real-world scenario, you would not include the database file in the repository.
2. The graph will look weird if the transaction dates are far apart. You can have linearly generated x-labels, but then it seems like money was made/expensed on dates when there are actually no transactions.
3. The form fields are duplicated: once for the create form, and once for the update form. In this simple case, you could argue that you should make one (UI-only) component for this, and conditionally populate the fields depending on if you are creating or updating.

## Challenges & limitations
1. The subtotal is calculated by retrieving all transactions from the database and then summing their amounts.  In a real-world scenario, you would probably use something like event-sourcing to keep a state of the subtotal and update it when a new transaction is created, updated or deleted.
2. In a non-SSR SPA I would set the `locale` parameter of `utils/dateFormatter.ts` to `undefined`, because it then defaults to the user's locale & timezone. However, this caused a hydration error. Hardcoding the locale fixes the issue, but obviously that is not ideal. I would probably fix this by trying to get the locale from the request headers, and then passing that along in the app (maybe through a [context provider](https://jfranciscosousa.com/blog/locale-detection-with-remix-run)), but I assumed that was out of scope for this demo.
3. Similar to the point above, the date locale in the graph is also hardcoded, and only a dot (.) works as decimal separator in the form.
4. The app is not responsive.
5. I used HTML validation for the form, and I did not add error highlighting. I assumed this would suffice for the demo.
