import { SerializeFrom } from '@remix-run/node';
import { Chart as ChartJS, registerables } from 'chart.js';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import type { TransactionSubtotalOverTime } from '~/server/transactions.server';
import 'chartjs-adapter-luxon';

ChartJS.register(...registerables);

interface Subtotals {
  date: string,
  subtotal: number,
}

interface Series {
  label: string,
  data: Array<Subtotals>,
}

interface TransactionSubtotalGraphProps {
  transactions: SerializeFrom<Array<TransactionSubtotalOverTime>>;
}

export default function TransactionSubtotalGraph({
  transactions,
}: TransactionSubtotalGraphProps) {
  // Memoize the graph data so we don't recalculate it on every render
  const graphData = useMemo(() => {
    const dates = transactions.map((transaction) => transaction.date);
    const values = transactions.map((transaction) => transaction.subtotal);

    return { dates, values };
  }, [transactions]);

  return (
    <div>
      <h2 className="font-bold text-xl text-emerald-900">Subtotal over time</h2>

      <Line
        className="mt-4"
        options={{
          locale: 'en-US',

          scales: {
            x: {
              type: 'time',
              ticks: {
                source: 'labels',
                minRotation: 50,
              },
              time: {
                unit: 'day',
                tooltipFormat: 'MMMM d, yyyy',
              },
              adapters: {
                date: {
                  locale: 'en-US',
                  zone: 'UTC',
                },
              },
            }
          },
          plugins: {
            // Only one dataset is displayed, so no need for a legend
            legend: {
              display: false,
            },
          },
        }}
        data={{
          labels: graphData.dates,
          datasets: [
            {
              data: graphData.values,
              borderColor: '#059669',
            },
          ],
        }}
      />
    </div>
  );
}
