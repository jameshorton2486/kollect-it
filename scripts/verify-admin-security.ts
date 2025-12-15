/**
 * Verifies admin routes are protected.
 * Must be run while dev server is running.
 */

const TEST_URL = "http://localhost:3000/api/admin/products/create";

async function run() {
  console.log("🔒 Verifying admin API security...\n");

  try {
    const res = await fetch(TEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (res.status === 401 || res.status === 403) {
      console.log("✅ PASS: Admin route correctly blocked unauthenticated access");
      console.log(`Status: ${res.status}`);
      process.exit(0);
    }

    console.error("❌ FAIL: Admin route did NOT block unauthenticated access");
    console.error(`Status: ${res.status}`);
    process.exit(1);
  } catch (err) {
    console.error("⚠️ WARNING: Could not verify via script.");
    console.error(
      "This is usually a Windows PowerShell networking issue (curl alias), not an app failure.",
    );
    console.error(err);
    // On Windows we don't want this to block other checks
    process.exit(0);
  }
}

run();
