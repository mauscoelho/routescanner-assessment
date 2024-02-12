/**
 * Formats a currency to a localized string.
 */
const currencyFormatter = (amount: number): string => {
  const formatter: Intl.NumberFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  });

  return formatter.format(amount);
};

export default currencyFormatter;
