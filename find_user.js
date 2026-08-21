const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("All users in DB:", users.map(u => u.email));
  const user = await prisma.user.findUnique({ where: { email: '24btit107@gcu.edu.in' }});
  if (user) {
    console.log("Found user!");
  } else {
    console.log("User not found!");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
