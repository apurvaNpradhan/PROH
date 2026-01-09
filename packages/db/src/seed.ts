import { neon, neonConfig } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";
import { exercisesSeedData } from "./data/exercises";
import { exercises } from "./schema/exercise";

dotenv.config();
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const sql = neon(process.env.DATABASE_URL || "");
const db = drizzle(sql);

async function main() {
	console.log("Seeding data...");
	await db
		.insert(exercises)
		.values(
			exercisesSeedData.map((exercise) => ({
				exerciseId: exercise.exerciseId,
				name: exercise.name,
				gifUrl: exercise.gifUrl,
				targetMuscles: exercise.targetMuscles,
				bodyParts: exercise.bodyParts,
				equipments: exercise.equipments,
				secondaryMuscles: exercise.secondaryMuscles,
				instructions: exercise.instructions,
				isSystem: true,
			})),
		)
		.onConflictDoNothing();
	console.log("Seeding Finished");
	process.exit(0);
}
main()
	.then()
	.catch((err) => {
		console.error(err);
		process.exit(0);
	});
