import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SECTIONS, INITIAL_USERS } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  for (const s of SECTIONS) {
    await prisma.section.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
  }

  const defaultHash = await bcrypt.hash("UafSecurePass2026!", 10);

  for (const u of INITIAL_USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        fullName: u.fullName,
        email: u.email,
        passwordHash: defaultHash,
        role: u.role,
        sectionCode: u.sectionCode,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
