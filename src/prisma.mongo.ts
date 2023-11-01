import { PrismaClient } from "@prisma-mongo/prisma/client";

declare global {
  var mongo_prisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.mongo_prisma) {
    global.mongo_prisma = new PrismaClient();
  }
  prisma = global.mongo_prisma;
}

export default prisma;