import { neon, neonConfig } from "@neondatabase/serverless";
import { env } from "@stronk/env/server";
import { drizzle } from "drizzle-orm/neon-http";
import { reset } from "drizzle-seed";
import { createInterface } from "readline/promises";
import ws from "ws";
import { user } from "./schema/auth";
import { exercises } from "./schema/exercise";

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const sql = neon(env.DATABASE_URL || "");
const db = drizzle(sql);

const schemas = [exercises, user];

async function clearDatabase() {
	if (process.env.NODE_ENV === "production") {
		console.log("🚫 Operation aborted: Cannot clear database in production.");
		process.exit(0);
	}

	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const answer = await rl.question(
		'⚠️ This will delete all data in the database. Type "yes" to confirm: ',
	);
	rl.close();

	if (answer.toLowerCase() !== "yes") {
		console.log("� Operation aborted.");
		process.exit(0);
	}

	try {
		console.log("�🗑️ Clearing database...");
		await Promise.all(schemas.map((schema) => reset(db, schema)));
		console.log("✅ Database cleared successfully.");
		process.exit(0);
	} catch (err) {
		console.error("❌ Error clearing database:", err);
		process.exit(1);
	}
}

clearDatabase();
