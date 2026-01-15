/**
 * Admin Seeder
 * Seeds initial admin users
 */

import bcrypt from 'bcryptjs';

const seedAdmins = async (prisma) => {
  console.log('🌱 Seeding admin users...');

  const password = await bcrypt.hash('Admin@123', 12);

  const admins = [
    {
      email: 'superadmin@axon.com',
      password,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      emailVerified: true,
      isActive: true,
    },
    {
      email: 'admin@axon.com',
      password,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
      isActive: true,
    },
    {
      email: 'ezraleyeee@gmail.com',
      password,
      firstName: 'Ezra',
      lastName: 'Leye',
      role: 'SUPER_ADMIN',
      emailVerified: true,
      isActive: true,
    },
  ];

  for (const admin of admins) {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: admin.email },
    });

    if (!existingAdmin) {
      await prisma.user.create({ data: admin });
      console.log(`  ✅ Created admin: ${admin.email}`);
    } else {
      console.log(`  ⏭️  Admin already exists: ${admin.email}`);
    }
  }

  console.log('✅ Admin seeding completed');
};

export default seedAdmins;
