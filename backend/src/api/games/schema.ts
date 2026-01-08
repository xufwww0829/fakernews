import { t } from "elysia";

export const GameScore = t.Object({
  id: t.Integer(),
  userId: t.String(),
  gameType: t.Union([t.Literal("2048"), t.Literal("snake"), t.Literal("flappybird")]),
  score: t.Integer(),
  time: t.Integer(),
});

export const InsertGameScore = t.Object({
  userId: t.String(),
  score: t.Integer(),
});

export type GameScore = typeof GameScore.static;
export type InsertGameScore = typeof InsertGameScore.static;
