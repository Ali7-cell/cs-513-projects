import {
  checkAdminRateLimit,
  recordFailedAdminAttempt,
  resetAdminRateLimit,
} from "../src/lib/auth/rate-limiter";

function runTests() {
  console.log("=== Rate Limiter Verification Test ===");
  const testKey = "unit_test_ip";

  // 1. Initial State
  const initial = checkAdminRateLimit(testKey);
  console.log("1. Initial state (isLocked):", initial.isLocked);
  if (initial.isLocked) throw new Error("Expected initial state to be unlocked");

  // 2. 4 failed attempts
  for (let i = 1; i <= 4; i++) {
    const res = recordFailedAdminAttempt(testKey);
    console.log(`2. Attempt ${i}: attemptsLeft = ${res.attemptsLeft}, isLocked = ${res.isLocked}`);
    if (res.isLocked) throw new Error(`Expected attempt ${i} to NOT be locked`);
  }

  // 3. 5th failed attempt -> Trigger Lockout
  const fifth = recordFailedAdminAttempt(testKey);
  console.log(`3. 5th attempt: attemptsLeft = ${fifth.attemptsLeft}, isLocked = ${fifth.isLocked}, remainingMinutes = ${fifth.remainingMinutes}`);
  if (!fifth.isLocked || fifth.remainingMinutes !== 30) {
    throw new Error("Expected 5th attempt to trigger 30-minute lockout");
  }

  // 4. Verification that subsequent check reports locked
  const lockCheck = checkAdminRateLimit(testKey);
  console.log("4. Lock check post-lockout:", lockCheck);
  if (!lockCheck.isLocked) throw new Error("Expected lockCheck to report isLocked = true");

  // 5. Reset
  resetAdminRateLimit(testKey);
  const postReset = checkAdminRateLimit(testKey);
  console.log("5. Post-reset check (isLocked):", postReset.isLocked);
  if (postReset.isLocked) throw new Error("Expected rate limit to be cleared post-reset");

  console.log("=== ALL 5 RATE LIMITER TESTS PASSED SUCCESSFULLY! ===");
}

runTests();
