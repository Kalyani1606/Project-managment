const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { teacherProfile: true, studentProfile: true }
  });
  console.log("=== ALL USERS ===");
  users.forEach(u => {
    console.log(`Role: ${u.role} | Name: ${u.name} | Email: ${u.email}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

