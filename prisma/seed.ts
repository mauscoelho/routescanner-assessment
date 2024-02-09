import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.transaction.create({
    data: {
      description: 'Groceries',
      date: new Date('2024-02-01').toISOString(),
      amount: -33,
    },
  });

  await prisma.transaction.create({
    data: {
      description: 'Taxi reimbursement',
      date: new Date('2024-02-04').toISOString(),
      amount: 75,
    },
  });

  await prisma.transaction.create({
    data: {
      description: 'Dinner',
      date: new Date('2024-02-05').toISOString(),
      amount: -180.95,
    },
  });

  await prisma.transaction.create({
    data: {
      description: 'Tikkie for dinner',
      date: new Date('2024-02-10').toISOString(),
      amount: 95.48,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
