import('node:process');
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

(async () => {
  const id = process.argv[2] || '100645';
  const stop = await prisma.stop.findUnique({ where: { id } });
  console.log(JSON.stringify({ id, found: !!stop, stop }, null, 2));
  await prisma.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
