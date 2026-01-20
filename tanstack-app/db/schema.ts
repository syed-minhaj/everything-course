import {
    pgTable,
    serial,
    text,
    varchar,
    integer,
    jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {user} from  "./auth-schema";

/* ================= COURSE ================= */
export const courses = pgTable("courses", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    courseTitle: varchar("course_title", { length: 255 }).notNull(),
    introSummary: text("intro_summary").notNull(),
    createrId: text("creater_id").notNull(),
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

export const userToQuickQuizzesPassed = pgTable("user_to_quick_quizzes_passed", {
    userId: text("user_id")
        .references(() => user.id)
        .notNull(),
    quickQuizId: text("quick_quiz_id")
        .references(() => quickQuizzes.id)
        .notNull()
});

export const userToPrimaryMissionsPassed = pgTable("user_to_primary_missions_passed", {
    userId: text("user_id")
        .references(() => user.id)
        .notNull(),
    primaryMissionId: text("primary_mission_id")
        .references(() => primaryMissions.id)
        .notNull()
});

/* ================= RELATIONS ================= */
export const courseRelations = relations(courses, ({ many , one}) => ({
    modules: many(modules),
    creator: one(user, {
        fields: [courses.createrId],
        references: [user.id],
    }),
    student : many(user),
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

export const quickQuizzesRelations = relations(quickQuizzes, ({ one, many }) => ({
    module: one(modules, {
        fields: [quickQuizzes.moduleId],
        references: [modules.id],
    }),
    passedUsers: many(userToQuickQuizzesPassed)
}));

export const primaryMissionsRelations = relations(primaryMissions, ({ one , many }) => ({
    module: one(modules, {
        fields: [primaryMissions.moduleId],
        references: [modules.id],
    }),
    passedUsers: many(userToPrimaryMissionsPassed)
}));

export const externalResourcesRelations = relations(externalResources, ({ one }) => ({
    module: one(modules, {
        fields: [externalResources.moduleId],
        references: [modules.id],
    }),
}));

export const userToQuickQuizzesPassedRelations = relations(userToQuickQuizzesPassed, ({ one }) => ({
    user: one(user, {
        fields: [userToQuickQuizzesPassed.userId],
        references: [user.id],
    }),
    quiz: one(quickQuizzes, {
        fields: [userToQuickQuizzesPassed.quickQuizId],
        references: [quickQuizzes.id],
    }),
}));

export const userToPrimaryMissionsPassedRelations = relations(userToPrimaryMissionsPassed, ({ one }) => ({
    user: one(user, {
        fields: [userToPrimaryMissionsPassed.userId],
        references: [user.id],
    }),
    mission: one(primaryMissions, {
        fields: [userToPrimaryMissionsPassed.primaryMissionId],
        references: [primaryMissions.id],
    }),
}));
