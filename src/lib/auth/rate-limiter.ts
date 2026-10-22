interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
  firstAttemptAt: number;
}

// In-memory rate limiting map for admin login attempts
const adminAttemptsMap = new Map<string, AttemptRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export function checkAdminRateLimit(identifier: string = "admin_portal"): {
  isLocked: boolean;
  remainingMinutes?: number;
  message?: string;
} {
  const record = adminAttemptsMap.get(identifier);
  if (!record) {
    return { isLocked: false };
  }

  const now = Date.now();

  // If locked, check if lockout duration has passed
  if (record.lockedUntil) {
    if (now < record.lockedUntil) {
      const remainingMinutes = Math.ceil((record.lockedUntil - now) / (60 * 1000));
      return {
        isLocked: true,
        remainingMinutes,
        message: `Too many failed login attempts. Administrator portal is locked for security. Please try again after ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}.`,
      };
    } else {
      // Lockout expired, reset record
      adminAttemptsMap.delete(identifier);
      return { isLocked: false };
    }
  }

  return { isLocked: false };
}

export function recordFailedAdminAttempt(identifier: string = "admin_portal"): {
  isLocked: boolean;
  attemptsLeft: number;
  remainingMinutes?: number;
  message?: string;
} {
  const now = Date.now();
  let record = adminAttemptsMap.get(identifier);

  if (!record) {
    record = {
      count: 1,
      lockedUntil: null,
      firstAttemptAt: now,
    };
    adminAttemptsMap.set(identifier, record);
    return {
      isLocked: false,
      attemptsLeft: MAX_FAILED_ATTEMPTS - 1,
    };
  }

  // Increment count
  record.count += 1;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    const remainingMinutes = 30;
    return {
      isLocked: true,
      attemptsLeft: 0,
      remainingMinutes,
      message: "Too many failed login attempts (5/5). Administrator portal is locked for 30 minutes.",
    };
  }

  const attemptsLeft = MAX_FAILED_ATTEMPTS - record.count;
  return {
    isLocked: false,
    attemptsLeft,
    message: `Invalid credentials. ${attemptsLeft} attempt${attemptsLeft > 1 ? "s" : ""} remaining before 30-minute lockout.`,
  };
}

export function resetAdminRateLimit(identifier: string = "admin_portal"): void {
  adminAttemptsMap.delete(identifier);
}
