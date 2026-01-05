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

export const game2048Scores = sqliteTable("game2048_scores", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),

  userId: text().notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  score: integer().notNull(),

  bestTile: integer().notNull().default(2),

  time: integer().notNull()
    .$defaultFn(() => new Date().getTime()),

  moves: integer().notNull().default(0),
});

export const snakeScores = sqliteTable("snake_scores", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),

  userId: text().notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  score: integer().notNull(),

  time: integer().notNull()
    .$defaultFn(() => new Date().getTime()),

  duration: integer().notNull(),

  foodEaten: integer().notNull().default(0),
});

export const flappyBirdScores = sqliteTable("flappybird_scores", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),

  userId: text().notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  score: integer().notNull(),

  time: integer().notNull()
    .$defaultFn(() => new Date().getTime()),

  pipesPassed: integer().notNull().default(0),

  duration: integer().notNull(),
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
  game2048Scores: many(game2048Scores),
  snakeScores: many(snakeScores),
  flappyBirdScores: many(flappyBirdScores),
}));

export const game2048ScoresRelations = relations(game2048Scores, ({ one }) => ({
  user: one(users, {
    fields: [game2048Scores.userId],
    references: [users.id],
  }),
}));

export const snakeScoresRelations = relations(snakeScores, ({ one }) => ({
  user: one(users, {
    fields: [snakeScores.userId],
    references: [users.id],
  }),
}));

export const flappyBirdScoresRelations = relations(flappyBirdScores, ({ one }) => ({
  user: one(users, {
    fields: [flappyBirdScores.userId],
    references: [users.id],
  }),
}));
