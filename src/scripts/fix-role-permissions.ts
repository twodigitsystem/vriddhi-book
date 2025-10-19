/**
 * Script to fix corrupted role permissions in the database
 * 
 * Run this if you see JSON parse errors after updating roles
 * Usage: npx tsx src/scripts/fix-role-permissions.ts
 */

import prisma from "../lib/db";

async function fixRolePermissions() {
  console.log("🔍 Checking for corrupted role permissions...\n");

  try {
    // Get all roles
    const roles = await prisma.organizationRole.findMany();

    console.log(`📊 Found ${roles.length} roles in database\n`);

    let fixedCount = 0;
    let corruptedCount = 0;

    for (const role of roles) {
      try {
        // Try to parse the permission field
        let permission = role.permission;

        // Check if it's already valid JSON
        if (typeof permission === "string") {
          try {
            permission = JSON.parse(permission);
          } catch (e) {
            console.error(`❌ Role "${role.role}" has invalid JSON: ${permission}`);
            corruptedCount++;
            continue;
          }
        }

        // Check if it's an object (should be)
        if (typeof permission !== "object" || permission === null) {
          console.error(`❌ Role "${role.role}" has invalid permission type: ${typeof permission}`);
          corruptedCount++;
          continue;
        }

        // Re-save to ensure proper format
        await prisma.organizationRole.update({
          where: { id: role.id },
          data: {
            permission: JSON.parse(JSON.stringify(permission)),
          },
        });

        console.log(`✅ Fixed role: ${role.role}`);
        fixedCount++;
      } catch (error) {
        console.error(`❌ Error fixing role "${role.role}":`, error);
        corruptedCount++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Fixed: ${fixedCount}`);
    console.log(`   ❌ Corrupted: ${corruptedCount}`);
    console.log(`   📝 Total: ${roles.length}\n`);

    if (corruptedCount > 0) {
      console.log("⚠️  Some roles could not be fixed automatically.");
      console.log("   Consider deleting and recreating them.\n");
    } else {
      console.log("🎉 All roles are properly formatted!\n");
    }
  } catch (error) {
    console.error("💥 Error running fix script:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
fixRolePermissions()
  .then(() => {
    console.log("✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Script failed:", error);
    process.exit(1);
  });
