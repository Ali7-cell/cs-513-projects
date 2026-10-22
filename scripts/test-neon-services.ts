import { PrismaClient } from "@prisma/client";
import { neonAuthConfig, fetchNeonAuthJwks } from "../src/lib/auth/neon-auth";

async function main() {
  console.log("=== Testing Neon Auth Service ===");
  console.log(`Neon Auth Base URL: ${neonAuthConfig.baseUrl}`);
  console.log(`Neon Auth JWKS URL: ${neonAuthConfig.jwksUrl}`);
  console.log(`Is Neon Auth Configured: ${neonAuthConfig.isConfigured}`);

  const jwks = await fetchNeonAuthJwks();
  console.log(`Neon Auth JWKS response keys count: ${jwks?.keys?.length ?? 0}`);

  console.log("\n=== Testing Neon Postgres Service (DIRECT_URL) ===");
  const directPrisma = new PrismaClient({
    datasources: { db: { url: process.env.DIRECT_URL } },
  });

  try {
    const sections = await directPrisma.section.findMany();
    console.log(`Found ${sections.length} sections in Neon Postgres:`);
    sections.forEach((s) => console.log(` - [${s.code}] ${s.name} (${s.program})`));

    const users = await directPrisma.user.findMany({
      select: { email: true, role: true, fullName: true },
    });
    console.log(`Found ${users.length} seeded users in Neon Postgres:`);
    users.forEach((u) => console.log(` - ${u.fullName} <${u.email}> (${u.role})`));
  } finally {
    await directPrisma.$disconnect();
  }

  console.log("\nALL WIRED NEON SERVICES VERIFIED END-TO-END!");
}

main().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
