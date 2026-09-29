import "dotenv/config";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createDb } from "./db/index.js";

const config = loadConfig();
const { db, pool } = createDb(config);
const server = createApp(db, config).listen(config.PORT, () => console.log(`server listening on :${config.PORT}`));

async function shutdown() {
  server.close(async () => { await pool.end(); process.exit(0); });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
