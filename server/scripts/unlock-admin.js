#!/usr/bin/env node

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { UsersModel } from '../models/index.js';
import { initializeDatabase } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Manual admin account unlock script
 * Usage: node scripts/unlock-admin.js [username]
 */

function showUsage() {
    console.log(`
🔓 Admin Account Unlock Script

Usage: node scripts/unlock-admin.js [username]

Examples:
  node scripts/unlock-admin.js admin
  node scripts/unlock-admin.js myusername

This script will:
  • Reset failed login attempts to 0
  • Remove account lockout
  • Clear lockout expiry time
  • Allow immediate login access

⚠️  Security Notice:
This script should only be used when you have legitimate access
to the server and need to unlock an admin account that has been
locked due to failed login attempts.
    `);
}

async function unlockAccount(username) {
    try {
        // Initialize database connection
        initializeDatabase();

        // Check if user exists
        const user = UsersModel.getByUsername(username);
        if (!user) {
            console.log(`❌ Error: User '${username}' not found.`);
            console.log(`\nAvailable users:`);
            
            const allUsers = UsersModel.getAll();
            if (allUsers.length === 0) {
                console.log(`   No users found in database.`);
            } else {
                allUsers.forEach(u => {
                    console.log(`   • ${u.username} (${u.email}) - ${u.role}`);
                });
            }
            return false;
        }

        // Check current lockout status
        const lockStatus = UsersModel.isAccountLocked(username);
        
        if (!lockStatus.locked && (user.failed_attempts || 0) === 0) {
            console.log(`ℹ️  Account '${username}' is not locked and has no failed attempts.`);
            console.log(`   Current status: Active and ready for login`);
            return true;
        }

        console.log(`🔍 Current account status for '${username}':`);
        console.log(`   Failed attempts: ${user.failed_attempts || 0}`);
        console.log(`   Locked: ${lockStatus.locked ? 'Yes' : 'No'}`);
        if (lockStatus.locked_until) {
            console.log(`   Locked until: ${new Date(lockStatus.locked_until).toLocaleString()}`);
        }

        // Unlock the account
        console.log(`\n🔓 Unlocking account '${username}'...`);
        const result = UsersModel.unlockAccount(username);

        if (result) {
            console.log(`✅ Success! Account '${username}' has been unlocked.`);
            console.log(`\n📊 Updated account status:`);
            console.log(`   Failed attempts: 0`);
            console.log(`   Locked: No`);
            console.log(`   Status: Ready for login`);
            console.log(`\n🎉 The user can now log in immediately.`);
            return true;
        } else {
            console.log(`❌ Failed to unlock account '${username}'.`);
            return false;
        }

    } catch (error) {
        console.error(`❌ Error unlocking account:`, error.message);
        return false;
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        showUsage();
        process.exit(0);
    }

    const username = args[0];

    if (!username) {
        console.log(`❌ Error: Username is required.`);
        showUsage();
        process.exit(1);
    }

    console.log(`🔐 Portfolio Admin Unlock Script`);
    console.log(`===============================`);
    console.log(`Target username: ${username}`);
    console.log(`Timestamp: ${new Date().toLocaleString()}\n`);

    const success = await unlockAccount(username);
    
    if (success) {
        console.log(`\n🏁 Script completed successfully.`);
        process.exit(0);
    } else {
        console.log(`\n💥 Script failed. Please check the error messages above.`);
        process.exit(1);
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error(`\n💥 Unexpected error:`, error.message);
    console.log(`\nThis might be due to:`);
    console.log(`  • Database file not found or corrupted`);
    console.log(`  • Incorrect file permissions`);
    console.log(`  • Database schema mismatch`);
    console.log(`\nPlease check your database configuration and try again.`);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error(`\n💥 Unhandled promise rejection:`, reason);
    process.exit(1);
});

// Run the script
main();
