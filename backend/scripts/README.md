# Utility Scripts

This directory contains utility scripts for database maintenance and testing.

## 📁 Available Scripts

### 1. `fix-orphaned-users.js`

**Purpose**: Fixes users who don't have associated carts or wishlists (created before the transaction fix).

**When to use**:
- After applying the authentication bug fix
- If users are unable to log in due to missing cart/wishlist records
- During database maintenance

**How to run**:
```bash
node scripts/fix-orphaned-users.js
```

**What it does**:
1. Scans all regular users (role: USER)
2. Identifies users missing cart or wishlist
3. Creates missing cart and/or wishlist records
4. Reports summary of fixed users

**Output example**:
```
🔍 Searching for orphaned users...
📊 Found 10 users to check

🔧 Fixing user: john@example.com
  ✅ Created cart
  ✅ Created wishlist

================================================================================
✅ Cleanup complete!
📊 Total users checked: 10
🔧 Users fixed: 3
✨ Users already OK: 7

📋 Fixed users:
  - john@example.com (cart: ❌→✅, wishlist: ❌→✅)
  - jane@example.com (cart: ❌→✅, wishlist: ✅)
  - bob@example.com (cart: ✅, wishlist: ❌→✅)

🎉 All users should now be able to log in successfully!
```

---

### 2. `test-auth-flow.js`

**Purpose**: Tests the complete authentication flow to verify the fix is working correctly.

**When to use**:
- After applying the authentication bug fix
- During development to verify authentication works
- Before deploying to production
- After database migrations

**How to run**:
```bash
node scripts/test-auth-flow.js
```

**What it does**:
1. Creates a test user with email, password, cart, and wishlist
2. Verifies user exists in database with all relations
3. Tests login flow and password verification
4. Cleans up test data
5. Reports detailed results

**Output example**:
```
🧪 Starting Authentication Flow Test

============================================================

📧 Step 1: Checking if email exists...
✅ Email is available

🔐 Step 2: Hashing password...
✅ Password hashed successfully
   Salt rounds: 12
   Hash length: 60 characters

👤 Step 3: Creating user with transaction...
✅ User created
   ID: 123e4567-e89b-12d3-a456-426614174000
   Email: test-1706380800000@example.com
   Active: true
✅ Cart created
✅ Wishlist created

🔍 Step 4: Verifying user in database...
✅ User found in database
   Has cart: ✅
   Has wishlist: ✅

🔑 Step 5: Testing login flow...
✅ User found during login
✅ User account is active
✅ Password verified successfully

🧹 Step 6: Cleaning up test data...
✅ Test user deleted

============================================================
🎉 ALL TESTS PASSED!
============================================================

✅ Registration flow: WORKING
✅ Database transaction: WORKING
✅ Cart creation: WORKING
✅ Wishlist creation: WORKING
✅ Login flow: WORKING
✅ Password verification: WORKING

🚀 Your authentication system is working correctly!
```

---

## 🚀 Quick Start

### First Time Setup After Fix

1. **Fix existing orphaned users**:
   ```bash
   node scripts/fix-orphaned-users.js
   ```

2. **Test the authentication flow**:
   ```bash
   node scripts/test-auth-flow.js
   ```

3. If both scripts show success, your authentication is fixed! ✅

---

## 🐛 Troubleshooting

### "Database connection failed"

**Solution**: Make sure your database is running and `DATABASE_URL` is set in `.env`

```bash
# Check if PostgreSQL is running
docker ps  # If using Docker

# Or check your database connection
npm run prisma:studio
```

### "User already exists" error in test script

**Solution**: The test script uses timestamp-based emails, but if you run it too quickly:

```bash
# Just wait a second and run again, or manually delete test users
```

### "Cannot find module" error

**Solution**: Make sure you're running from the project root:

```bash
# Run from project root
cd /path/to/Axon_Backend
node scripts/fix-orphaned-users.js
```

### Fix script finds no orphaned users but login still fails

**Solution**: Check the specific user:

```bash
# Open Prisma Studio
npm run prisma:studio

# Check if the user exists in:
# - users table
# - carts table (with matching userId)
# - wishlists table (with matching userId)
```

---

## 📚 Additional Resources

- See [AUTH_FIX_EXPLANATION.md](../AUTH_FIX_EXPLANATION.md) for detailed explanation of the bug and fix
- See [src/services/authService.js](../src/services/authService.js) for the fixed registration code

---

## ⚠️ Important Notes

1. **Run `fix-orphaned-users.js` only once** after applying the fix. Running it multiple times is safe but unnecessary.

2. **`test-auth-flow.js` can be run multiple times** - it cleans up after itself.

3. **Both scripts require database access** - ensure your database is running.

4. **These scripts are safe for production** - they only create/fix data, never delete (except test data).

---

## 🤝 Contributing

If you create new utility scripts, please:
1. Add them to this directory
2. Update this README with documentation
3. Follow the existing code style
4. Include proper error handling and logging
