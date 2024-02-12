/**
 * Format the date string to localized date
 */
const dateFormatter = (date: string): string => {
  // convert the date string to localized date
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default dateFormatter;
