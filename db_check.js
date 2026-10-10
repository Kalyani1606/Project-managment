const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Users:', await prisma.user.count());
  console.log('Reviewers:', await prisma.user.count({ where: { role: 'REVIEWER' } }));
  console.log('Assignments:', await prisma.reviewAssignment.count());
  console.log('Evaluations:', await prisma.reviewerEvaluation.count());
}

main().catch(console.error).finally(() => prisma.$disconnect());
