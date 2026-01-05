import { t } from "elysia";

export const GameScore = t.Object({
  id: t.Integer(),
  userId: t.String(),
  score: t.Integer(),
  time: t.Integer(),
});

export const Game2048Score = t.Object({
  ...GameScore.properties,
  bestTile: t.Integer(),
  moves: t.Integer(),
});

export const SnakeScore = t.Object({
  ...GameScore.properties,
  duration: t.Integer(),
  foodEaten: t.Integer(),
});

export const FlappyBirdScore = t.Object({
  ...GameScore.properties,
  pipesPassed: t.Integer(),
  duration: t.Integer(),
});

export const InsertGame2048Score = t.Object({
  userId: t.String(),
  score: t.Integer(),
  bestTile: t.Optional(t.Integer()),
  moves: t.Optional(t.Integer()),
});

export const InsertSnakeScore = t.Object({
  userId: t.String(),
  score: t.Integer(),
  duration: t.Integer(),
  foodEaten: t.Optional(t.Integer()),
});

export const InsertFlappyBirdScore = t.Object({
  userId: t.String(),
  score: t.Integer(),
  pipesPassed: t.Integer(),
  duration: t.Integer(),
});

export type Game2048Score = typeof Game2048Score.static;
export type SnakeScore = typeof SnakeScore.static;
export type FlappyBirdScore = typeof FlappyBirdScore.static;
export type InsertGame2048Score = typeof InsertGame2048Score.static;
export type InsertSnakeScore = typeof InsertSnakeScore.static;
export type InsertFlappyBirdScore = typeof InsertFlappyBirdScore.static;
