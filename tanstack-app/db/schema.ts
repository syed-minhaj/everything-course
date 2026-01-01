import {
    pgTable,
    serial,
    text,
    varchar,
    integer,
    jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ================= COURSE ================= */
export const courses = pgTable("courses", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    courseTitle: varchar("course_title", { length: 255 }).notNull(),
    introSummary: text("intro_summary").notNull(),
});

/* ================= MODULE ================= */
export const modules = pgTable("modules", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    courseId: text("course_id")
        .references(() => courses.id)
        .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    conceptualDeepDive: text("conceptual_deep_dive").notNull(),
});

/* ================= EXTERNAL RESOURCES ================= */
export const externalResources = pgTable("external_resources", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    moduleId: text("module_id")
        .references(() => modules.id)
        .notNull(),
    type: varchar("type", { length: 50 }).notNull(), // article | youtube | podcast
    title: varchar("title", { length: 255 }).notNull(),
    url: text("url").notNull(),
});

/* ================= PRIMARY MISSION ================= */
export const primaryMissions = pgTable("primary_missions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    moduleId: text("module_id")
        .references(() => modules.id)
        .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    instructions: text("instructions").notNull(),
    rubric: jsonb("rubric").$type<string[]>().notNull(),
});

/* ================= QUICK QUIZ ================= */
export const quickQuizzes = pgTable("quick_quizzes", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    moduleId: text("module_id")
        .references(() => modules.id)
        .notNull(),
    question: text("question").notNull(),
    options: jsonb("options").$type<string[]>().notNull(),
    answer: varchar("answer", { length: 10 }).notNull(),
});

/* ================= RELATIONS ================= */
export const courseRelations = relations(courses, ({ many }) => ({
    modules: many(modules),
}));

export const moduleRelations = relations(modules, ({ many, one }) => ({
    course: one(courses, {
        fields: [modules.courseId],
        references: [courses.id],
    }),
    resources: many(externalResources),
    missions: many(primaryMissions),
    quizzes: many(quickQuizzes),
}));

export const quickQuizzesRelations = relations(quickQuizzes, ({ one }) => ({
    module: one(modules, {
        fields: [quickQuizzes.moduleId],
        references: [modules.id],
    }),
}));

export const primaryMissionsRelations = relations(primaryMissions, ({ one }) => ({
    module: one(modules, {
        fields: [primaryMissions.moduleId],
        references: [modules.id],
    }),
}));

export const externalResourcesRelations = relations(externalResources, ({ one }) => ({
    module: one(modules, {
        fields: [externalResources.moduleId],
        references: [modules.id],
    }),
}));