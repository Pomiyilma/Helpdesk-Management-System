// prisma/seed.ts
import 'dotenv/config';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

console.log(process.env.DATABASE_URL);

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create Users
  const usersToCreate = [
    { email: 'manager1@company.com', name: 'Manager One', role: 'MANAGER' },
    { email: 'manager2@company.com', name: 'Manager Two', role: 'MANAGER' },
    { email: 'tech1@company.com', name: 'Tech One', role: 'TECHNICAL' },
    { email: 'tech2@company.com', name: 'Tech Two', role: 'TECHNICAL' },
    { email: 'tech3@company.com', name: 'Tech Three', role: 'TECHNICAL' },
    { email: 'emp1@company.com', name: 'Employee One', role: 'EMPLOYEE' },
    { email: 'emp2@company.com', name: 'Employee Two', role: 'EMPLOYEE' },
    { email: 'emp3@company.com', name: 'Employee Three', role: 'EMPLOYEE' },
  ];

  for (const user of usersToCreate) {
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

  const allUsers = await prisma.user.findMany();

  const manager1 = allUsers.find(u => u.email === 'manager1@company.com');
  const manager2 = allUsers.find(u => u.email === 'manager2@company.com');
  const tech1 = allUsers.find(u => u.email === 'tech1@company.com');
  const tech2 = allUsers.find(u => u.email === 'tech2@company.com');
  const tech3 = allUsers.find(u => u.email === 'tech3@company.com');
  const emp1 = allUsers.find(u => u.email === 'emp1@company.com');
  const emp2 = allUsers.find(u => u.email === 'emp2@company.com');
  const emp3 = allUsers.find(u => u.email === 'emp3@company.com');

  if (!manager1 || !manager2 || !tech1 || !tech2 || !tech3 || !emp1 || !emp2 || !emp3) {
    throw new Error('Not all users found for ticket seeding');
  }

  const sampleTickets = [
    {
      title: 'Laptop screen flickering',
      description: 'My laptop screen has been flickering intermittently for the past week. It happens more frequently when I move the laptop.',
      category: 'IT_SUPPORT' as const,
      priority: 'HIGH' as const,
      status: 'OPEN' as const,
      createdById: emp1.id,
      assignedToId: null,
    },
    {
      title: 'Office AC not working',
      description: 'The air conditioning in the main office area is not cooling properly. Temperature is uncomfortable.',
      category: 'FACILITIES' as const,
      priority: 'MEDIUM' as const,
      status: 'ASSIGNED' as const,
      createdById: emp2.id,
      assignedToId: tech2.id,
    },
    {
      title: 'VPN connection drops',
      description: 'VPN connection drops every 30 minutes when working from home. Need stable connection for meetings.',
      category: 'IT_SUPPORT' as const,
      priority: 'HIGH' as const,
      status: 'IN_PROGRESS' as const,
      createdById: emp1.id,
      assignedToId: tech1.id,
    },
    {
      title: 'Request for ergonomic chair',
      description: 'Current chair is causing back pain. Requesting an ergonomic chair replacement.',
      category: 'HR' as const,
      priority: 'LOW' as const,
      status: 'OPEN' as const,
      createdById: emp3.id,
      assignedToId: null,
    },
    {
      title: 'Printer jamming frequently',
      description: 'The shared printer on floor 3 jams frequently. Need maintenance or replacement.',
      category: 'FACILITIES' as const,
      priority: 'MEDIUM' as const,
      status: 'RESOLVED' as const,
      createdById: emp2.id,
      assignedToId: tech3.id,
    },
    {
      title: 'Email access blocked',
      description: 'Cannot access corporate email. Getting authentication error. Urgent - need access for client work.',
      category: 'IT_SUPPORT' as const,
      priority: 'CRITICAL' as const,
      status: 'ASSIGNED' as const,
      createdById: manager1.id,
      assignedToId: tech1.id,
    },
    {
      title: 'Conference room projector broken',
      description: 'Projector in conference room B is not displaying correctly. Need fix before Friday presentation.',
      category: 'FACILITIES' as const,
      priority: 'HIGH' as const,
      status: 'OPEN' as const,
      createdById: manager2.id,
      assignedToId: null,
    },
    {
      title: 'Software license renewal',
      description: 'Design software license expiring next week. Need renewal approval.',
      category: 'HR' as const,
      priority: 'MEDIUM' as const,
      status: 'IN_PROGRESS' as const,
      createdById: emp3.id,
      assignedToId: tech2.id,
    },
    {
      title: 'WiFi slow in meeting rooms',
      description: 'WiFi speed is very slow in all meeting rooms. Makes video calls difficult.',
      category: 'IT_SUPPORT' as const,
      priority: 'MEDIUM' as const,
      status: 'OPEN' as const,
      createdById: emp1.id,
      assignedToId: null,
    },
    {
      title: 'Keyboard keys not responding',
      description: 'Several keys on my keyboard are not responding consistently. Need replacement.',
      category: 'IT_SUPPORT' as const,
      priority: 'LOW' as const,
      status: 'RESOLVED' as const,
      createdById: emp2.id,
      assignedToId: tech3.id,
    },
    {
      title: 'Parking space allocation',
      description: 'Need assigned parking space as I now come to office 3 days a week.',
      category: 'OTHER' as const,
      priority: 'LOW' as const,
      status: 'OPEN' as const,
      createdById: emp3.id,
      assignedToId: null,
    },
    {
      title: 'Server downtime alert',
      description: 'Received alerts about server downtime during off-hours. Need investigation.',
      category: 'IT_SUPPORT' as const,
      priority: 'CRITICAL' as const,
      status: 'IN_PROGRESS' as const,
      createdById: manager1.id,
      assignedToId: tech1.id,
    },
    {
      title: 'Leave balance inquiry',
      description: 'Need clarification on remaining leave balance for this year.',
      category: 'HR' as const,
      priority: 'LOW' as const,
      status: 'CLOSED' as const,
      createdById: emp1.id,
      assignedToId: null,
    },
    {
      title: 'Desk phone not working',
      description: 'Desk phone display is blank and no dial tone. Cannot make/receive calls.',
      category: 'IT_SUPPORT' as const,
      priority: 'HIGH' as const,
      status: 'ASSIGNED' as const,
      createdById: emp2.id,
      assignedToId: tech2.id,
    },
    {
      title: 'Security badge not working',
      description: 'Security badge stopped working this morning. Cannot access building.',
      category: 'FACILITIES' as const,
      priority: 'CRITICAL' as const,
      status: 'RESOLVED' as const,
      createdById: emp3.id,
      assignedToId: tech3.id,
    },
  ];

  let ticketCounter = 1;
  for (const ticket of sampleTickets) {
    await prisma.ticket.upsert({
      where: { ticketId: `TKT-${String(ticketCounter).padStart(4, '0')}` },
      update: {},
      create: {
        ...ticket,
        ticketId: `TKT-${String(ticketCounter).padStart(4, '0')}`,
      },
    });
    ticketCounter++;
  }

  console.log('Sample tickets seeded!');
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
