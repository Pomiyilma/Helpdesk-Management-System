// prisma/seed.ts
import 'dotenv/config';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

console.log(process.env.DATABASE_URL);

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create Users
  const users = [
    { email: 'manager1@company.com', name: 'Manager One', role: 'MANAGER' },
    { email: 'manager2@company.com', name: 'Manager Two', role: 'MANAGER' },
    { email: 'tech1@company.com', name: 'Tech One', role: 'TECHNICAL' },
    { email: 'tech2@company.com', name: 'Tech Two', role: 'TECHNICAL' },
    { email: 'tech3@company.com', name: 'Tech Three', role: 'TECHNICAL' },
    { email: 'emp1@company.com', name: 'Employee One', role: 'EMPLOYEE' },
    { email: 'emp2@company.com', name: 'Employee Two', role: 'EMPLOYEE' },
    { email: 'emp3@company.com', name: 'Employee Three', role: 'EMPLOYEE' },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        role: user.role as 'MANAGER' | 'TECHNICAL' | 'EMPLOYEE', 
      },
    });
  }

  console.log('Users seeded!');

  //here Add sample tickets later if needed
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
