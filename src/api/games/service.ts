import { db } from "../../db";
import { game2048Scores, snakeScores, flappyBirdScores } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

export const get2048ScoresByUserId = async ({ params }: { params: { userId: string } }) => {
  const scores = await db.query.game2048Scores.findMany({
    where: eq(game2048Scores.userId, params.userId),
    orderBy: desc(game2048Scores.score),
    limit: 10,
  });

  if (!scores || scores.length === 0) {
    return { message: "No 2048 scores found for this user", scores: [] };
  }

  return { scores };
};

export const create2048Score = async ({ body }: { body: any }) => {
  try {
    const newScore = await db.insert(game2048Scores).values({
      userId: body.userId,
      score: body.score,
      bestTile: body.bestTile || 2,
      moves: body.moves || 0,
      time: new Date().getTime(),
    }).returning();

    return newScore[0];
  } catch (error) {
    console.error("Error creating 2048 score:", error);
    return { error: "Failed to create 2048 score" };
  }
};

export const getSnakeScoresByUserId = async ({ params }: { params: { userId: string } }) => {
  const scores = await db.query.snakeScores.findMany({
    where: eq(snakeScores.userId, params.userId),
    orderBy: desc(snakeScores.score),
    limit: 10,
  });

  if (!scores || scores.length === 0) {
    return { message: "No snake scores found for this user", scores: [] };
  }

  return { scores };
};

export const createSnakeScore = async ({ body }: { body: any }) => {
  try {
    const newScore = await db.insert(snakeScores).values({
      userId: body.userId,
      score: body.score,
      duration: body.duration,
      foodEaten: body.foodEaten || 0,
      time: new Date().getTime(),
    }).returning();

    return newScore[0];
  } catch (error) {
    console.error("Error creating snake score:", error);
    return { error: "Failed to create snake score" };
  }
};

export const getFlappyBirdScoresByUserId = async ({ params }: { params: { userId: string } }) => {
  const scores = await db.query.flappyBirdScores.findMany({
    where: eq(flappyBirdScores.userId, params.userId),
    orderBy: desc(flappyBirdScores.score),
    limit: 10,
  });

  if (!scores || scores.length === 0) {
    return { message: "No Flappy Bird scores found for this user", scores: [] };
  }

  return { scores };
};

export const createFlappyBirdScore = async ({ body }: { body: any }) => {
  try {
    const newScore = await db.insert(flappyBirdScores).values({
      userId: body.userId,
      score: body.score,
      pipesPassed: body.pipesPassed,
      duration: body.duration,
      time: new Date().getTime(),
    }).returning();

    return newScore[0];
  } catch (error) {
    console.error("Error creating Flappy Bird score:", error);
    return { error: "Failed to create Flappy Bird score" };
  }
};

export const getTopScores = async ({ params }: { params: { game: string; limit?: string } }) => {
  const limit = params.limit ? parseInt(params.limit) : 10;

  try {
    switch (params.game) {
      case "2048":
        const top2048 = await db.query.game2048Scores.findMany({
          orderBy: desc(game2048Scores.score),
          limit,
          with: {
            user: {
              columns: {
                id: true,
              },
            },
          },
        });
        return top2048;

      case "snake":
        const topSnake = await db.query.snakeScores.findMany({
          orderBy: desc(snakeScores.score),
          limit,
          with: {
            user: {
              columns: {
                id: true,
              },
            },
          },
        });
        return topSnake;

      case "flappybird":
        const topFlappy = await db.query.flappyBirdScores.findMany({
          orderBy: desc(flappyBirdScores.score),
          limit,
          with: {
            user: {
              columns: {
                id: true,
              },
            },
          },
        });
        return topFlappy;

      default:
        return { error: "Invalid game type. Valid options: 2048, snake, flappybird" };
    }
  } catch (error) {
    console.error("Error fetching top scores:", error);
    return { error: "Failed to fetch top scores" };
  }
};