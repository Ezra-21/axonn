/**
 * Database Cleanup Script
 * Fixes orphaned users who don't have carts or wishlists
 * 
 * Run this script to clean up any users created before the transaction fix
 * Usage: node scripts/fix-orphaned-users.js
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixOrphanedUsers() {
  try {
    console.log('🔍 Searching for orphaned users...');

    // Find all users
    const allUsers = await prisma.user.findMany({
      where: {
        role: 'USER', // Only fix regular users, not admins
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        cart: true,
        wishlist: true,
      },
    });

    console.log(`📊 Found ${allUsers.length} users to check`);

    let fixedCount = 0;
    const orphanedUsers = [];

    for (const user of allUsers) {
      const needsCart = !user.cart;
      const needsWishlist = !user.wishlist;

      if (needsCart || needsWishlist) {
        orphanedUsers.push({
          email: user.email,
          needsCart,
          needsWishlist,
        });

        console.log(`\n🔧 Fixing user: ${user.email}`);

        // Create missing cart
        if (needsCart) {
          await prisma.cart.create({
            data: { userId: user.id },
          });
          console.log('  ✅ Created cart');
        }

        // Create missing wishlist
        if (needsWishlist) {
          await prisma.wishlist.create({
            data: { userId: user.id },
          });
          console.log('  ✅ Created wishlist');
        }

        fixedCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Cleanup complete!`);
    console.log(`📊 Total users checked: ${allUsers.length}`);
    console.log(`🔧 Users fixed: ${fixedCount}`);
    console.log(`✨ Users already OK: ${allUsers.length - fixedCount}`);

    if (orphanedUsers.length > 0) {
      console.log('\n📋 Fixed users:');
      orphanedUsers.forEach((u) => {
        console.log(`  - ${u.email} (cart: ${u.needsCart ? '❌→✅' : '✅'}, wishlist: ${u.needsWishlist ? '❌→✅' : '✅'})`);
      });
    }

    console.log('\n🎉 All users should now be able to log in successfully!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
fixOrphanedUsers();
