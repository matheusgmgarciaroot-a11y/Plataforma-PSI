import { prisma } from '../index.ts';
import * as bcrypt from 'bcryptjs';

async function main() {
  const masterEmail = 'master@mindora.com';
  
  // Check if master user already exists
  const existingMaster = await prisma.professional.findUnique({
    where: { email: masterEmail },
  });

  if (existingMaster) {
    console.log('Master user already exists.');
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('master123', salt);

  // Create master user
  const master = await prisma.professional.create({
    data: {
      name: 'Admin Master',
      email: masterEmail,
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      specialty: 'Administrador do Sistema',
      crp: '000000',
    },
  });

  console.log('Master user seeded successfully:', master.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
