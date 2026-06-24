import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  const password = await bcrypt.hash("admin@123", 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@test.com",
      password,
      role: "admin",
    },
  });

  console.log("Admin created");
}

main();
