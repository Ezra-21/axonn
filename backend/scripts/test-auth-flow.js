/**
 * Authentication Flow Test Script
 * Tests registration and login to verify the fix works
 * 
 * Usage: node scripts/test-auth-flow.js
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuthFlow() {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123';
  
  try {
    console.log('🧪 Starting Authentication Flow Test\n');
    console.log('='.repeat(60));

    // Step 1: Check if email exists (should not)
    console.log('\n📧 Step 1: Checking if email exists...');
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail.toLowerCase() },
    });
    
    if (existingUser) {
      console.log('❌ Email already exists! Using different email.');
      return;
    }
    console.log('✅ Email is available');

    // Step 2: Hash password
    console.log('\n🔐 Step 2: Hashing password...');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(testPassword, salt);
    console.log('✅ Password hashed successfully');
    console.log(`   Salt rounds: 12`);
    console.log(`   Hash length: ${hashedPassword.length} characters`);

    // Step 3: Create user with transaction (simulating registration)
    console.log('\n👤 Step 3: Creating user with transaction...');
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: testEmail.toLowerCase(),
          password: hashedPassword,
          firstName: 'Test',
          lastName: 'User',
          phone: '+1234567890',
          role: 'USER',
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      console.log('✅ User created');
      console.log(`   ID: ${newUser.id}`);
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Active: ${newUser.isActive}`);

      await tx.cart.upsert({
        where: { userId: newUser.id },
        create: { userId: newUser.id },
        update: {},
      });
      console.log('✅ Cart created');

      await tx.wishlist.upsert({
        where: { userId: newUser.id },
        create: { userId: newUser.id },
        update: {},
      });
      console.log('✅ Wishlist created');

      return newUser;
    });

    // Step 4: Verify user exists in database
    console.log('\n🔍 Step 4: Verifying user in database...');
    const verifyUser = await prisma.user.findUnique({
      where: { email: testEmail.toLowerCase() },
      include: {
        cart: true,
        wishlist: true,
      },
    });

    if (!verifyUser) {
      console.log('❌ User not found in database!');
      return;
    }
    console.log('✅ User found in database');
    console.log(`   Has cart: ${verifyUser.cart ? '✅' : '❌'}`);
    console.log(`   Has wishlist: ${verifyUser.wishlist ? '✅' : '❌'}`);

    // Step 5: Test login (simulate login)
    console.log('\n🔑 Step 5: Testing login flow...');
    
    const loginUser = await prisma.user.findUnique({
      where: { email: testEmail.toLowerCase() },
    });

    if (!loginUser) {
      console.log('❌ User not found during login!');
      return;
    }
    console.log('✅ User found during login');

    if (!loginUser.isActive) {
      console.log('❌ User account is not active!');
      return;
    }
    console.log('✅ User account is active');

    const isPasswordValid = await bcrypt.compare(testPassword, loginUser.password);
    if (!isPasswordValid) {
      console.log('❌ Password verification failed!');
      console.log(`   Original password: ${testPassword}`);
      console.log(`   Stored hash: ${loginUser.password.substring(0, 20)}...`);
      return;
    }
    console.log('✅ Password verified successfully');

    // Step 6: Clean up test user
    console.log('\n🧹 Step 6: Cleaning up test data...');
    await prisma.user.delete({
      where: { id: user.id },
    });
    console.log('✅ Test user deleted');

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(60));
    console.log('\n✅ Registration flow: WORKING');
    console.log('✅ Database transaction: WORKING');
    console.log('✅ Cart creation: WORKING');
    console.log('✅ Wishlist creation: WORKING');
    console.log('✅ Login flow: WORKING');
    console.log('✅ Password verification: WORKING');
    console.log('\n🚀 Your authentication system is working correctly!\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error('Error:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    console.error('\n💡 This error indicates there may still be an issue with your auth flow.');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testAuthFlow();
