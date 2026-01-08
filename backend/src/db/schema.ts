import { relations } from "drizzle-orm";
import { sqliteTable, integer, text, AnySQLiteColumn } from "drizzle-orm/sqlite-core";

export const items = sqliteTable("items", {
  id: integer({ mode: "number" }).primaryKey(),

  deleted: integer({ mode: "boolean" }).default(false).notNull(),
  dead: integer({ mode: "boolean" }).default(false).notNull(),

  type: text({
    enum: ["story", "comment", "job"],
  }).notNull(),

  by: text().notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  time: integer().notNull()
    .$defaultFn(() => new Date().getTime()),

  text: text(),

  parent: integer({ mode: "number" })
    .references((): AnySQLiteColumn => items.id, {
      onDelete: "cascade",
    }),
  // poll: integer({ mode: "number" })
  //   .references((): AnySQLiteColumn => items.id, {
  //     onDelete: "cascade",
  //   }),

  url: text(),

  score: integer().notNull().default(0),

  title: text(),
});

export const users = sqliteTable("users", {
  id: text().primaryKey(),

  created: integer().notNull()
    .$defaultFn(() => new Date().getTime()),

  karma: integer().notNull().default(0),

  about: text(),
});

// Unified game scores table
export const gameScores = sqliteTable("game_scores", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),

  userId: text().notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  gameType: text({
    enum: ["2048", "snake", "flappybird"],
  }).notNull(),

  score: integer().notNull(),

  time: integer().notNull()
    .$defaultFn(() => new Date().getTime()),
});

export const itemsRelations = relations(items, ({ one, many }) => ({
  author: one(users, {
    fields: [items.by],
    references: [users.id],
  }),

  parent: one(items, {
    fields: [items.parent],
    references: [items.id],
    relationName: "parent-kids"
  }),

  kids: many(items, {
    relationName: "parent-kids"
  }),

  // poll: one(items, {
  //   fields: [items.poll],
  //   references: [items.id],
  //   relationName: "poll-opt"
  // }),

  // parts: many(items, {
  //   relationName: "poll-opt"
  // }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  items: many(items),
  gameScores: many(gameScores),
}));

export const gameScoresRelations = relations(gameScores, ({ one }) => ({
  user: one(users, {
    fields: [gameScores.userId],
    references: [users.id],
  }),
}));
