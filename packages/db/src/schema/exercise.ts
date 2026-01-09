import {
	bigint,
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type z from "zod";
import { timestamps } from "../utils/timestamps";
import { user } from "./auth";

export const exercises = pgTable(
	"exercises",
	{
		id: bigint("id", { mode: "bigint" })
			.generatedAlwaysAsIdentity()
			.primaryKey(),
		exerciseId: text("exercise_id").notNull().unique(),
		name: text("name").notNull(),
		gifUrl: text("gif_url").notNull(),
		targetMuscles: jsonb("target_muscles").$type<string[]>().notNull(),
		bodyParts: jsonb("body_parts").$type<string[]>().notNull(),
		equipments: jsonb("equipments").$type<string[]>().notNull(),
		secondaryMuscles: jsonb("secondary_muscles").$type<string[]>().notNull(),
		instructions: jsonb("instructions").$type<string[]>().notNull(),
		isSystem: boolean("is_system").notNull(),
		createdBy: uuid("created_by").references(() => user.id),
		...timestamps,
	},
	(t) => [
		index("created_by_idx").on(t.createdBy),
		index("exercise_id_idx").on(t.exerciseId),
	],
);

export const SelectExercise = createSelectSchema(exercises);
export type SelectExercise = z.infer<typeof SelectExercise>;

export const InsertExercise = createInsertSchema(exercises);
export type InsertExercise = z.infer<typeof InsertExercise>;
