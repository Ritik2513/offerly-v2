import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // prevent duplicate seed runs
  const existingTenant = await prisma.tenant.findFirst({
    where: {
      slug: "offerly-default",
    },
  });

  if (existingTenant) {
    console.log("Default tenant already exists");
    return;
  }

  const tenant = await prisma.tenant.create({
    data: {
      name: "Offerly Default",
      slug: "offerly-default",
    },
  });

  console.log("Seeded tenant:", tenant);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
