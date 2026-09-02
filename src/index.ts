import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";

const server = app.listen(env.PORT, () =>
  console.log(`Portfolio API listening on port ${env.PORT}`),
);

let isShuttingDown = false;
const shutdown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
