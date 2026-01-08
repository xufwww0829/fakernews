import { Elysia, status, t } from "elysia";
import { db } from "../../db";
import { gameScores } from "../../db/schema";
import { eq, desc, and } from "drizzle-orm";
import { GameScore, InsertGameScore } from "./schema";

const games = new Elysia({ prefix: "/games" })
  .get("/2048/users/:userId", async ({ params }) => {
    const scores = await db.query.gameScores.findMany({
      where: and(
        eq(gameScores.userId, params.userId),
        eq(gameScores.gameType, "2048")
      ),
      orderBy: desc(gameScores.score),
      limit: 10,
    });

    if (!scores || scores.length === 0) {
      return { message: "No 2048 scores found for this user", scores: [] };
    }

    return { scores };
  }, {
    params: t.Object({ userId: t.String() }),
    response: {
      200: t.Object({
        message: t.Optional(t.String()),
        scores: t.Array(GameScore),
      }),
    },
  })

  .post("/2048", async ({ body }) => {
    try {
      const newScore = await db.insert(gameScores).values({
        userId: body.userId,
        gameType: "2048",
        score: body.score,
        time: new Date().getTime(),
      }).returning();

      return newScore[0];
    } catch (err) {
      return status(500, "Failed to create 2048 score");
    }
  }, {
    body: InsertGameScore,
    response: {
      200: GameScore,
      500: t.String(),
    },
  })

  .get("/snake/users/:userId", async ({ params }) => {
    const scores = await db.query.gameScores.findMany({
      where: and(
        eq(gameScores.userId, params.userId),
        eq(gameScores.gameType, "snake")
      ),
      orderBy: desc(gameScores.score),
      limit: 10,
    });

    if (!scores || scores.length === 0) {
      return { message: "No snake scores found for this user", scores: [] };
    }

    return { scores };
  }, {
    params: t.Object({ userId: t.String() }),
    response: {
      200: t.Object({
        message: t.Optional(t.String()),
        scores: t.Array(GameScore),
      }),
    },
  })

  .post("/snake", async ({ body }) => {
    try {
      const newScore = await db.insert(gameScores).values({
        userId: body.userId,
        gameType: "snake",
        score: body.score,
        time: new Date().getTime(),
      }).returning();

      return newScore[0];
    } catch (err) {
      console.error("Error creating snake score:", err);
      return status(500, "Failed to create snake score");
    }
  }, {
    body: InsertGameScore,
    response: {
      200: GameScore,
      500: t.String(),
    },
  })

  .get("/flappybird/users/:userId", async ({ params }) => {
    const scores = await db.query.gameScores.findMany({
      where: and(
        eq(gameScores.userId, params.userId),
        eq(gameScores.gameType, "flappybird")
      ),
      orderBy: desc(gameScores.score),
      limit: 10,
    });

    if (!scores || scores.length === 0) {
      return { message: "No Flappy Bird scores found for this user", scores: [] };
    }

    return { scores };
  }, {
    params: t.Object({ userId: t.String() }),
    response: {
      200: t.Object({
        message: t.Optional(t.String()),
        scores: t.Array(GameScore),
      }),
    },
  })

  .post("/flappybird", async ({ body }) => {
    try {
      const newScore = await db.insert(gameScores).values({
        userId: body.userId,
        gameType: "flappybird",
        score: body.score,
        time: new Date().getTime(),
      }).returning();

      return newScore[0];
    } catch (err) {
      console.error("Error creating Flappy Bird score:", err);
      return status(500, "Failed to create Flappy Bird score");
    }
  }, {
    body: InsertGameScore,
    response: {
      200: GameScore,
      500: t.String(),
    },
  })

  .get("/leaderboard/:game", async ({ params, query }) => {
    const limit = query.limit ? parseInt(query.limit) : 10;

    try {
      const validGameTypes = ["2048", "snake", "flappybird"];

      if (!validGameTypes.includes(params.game)) {
        return status(400, "Invalid game type. Valid options: 2048, snake, flappybird");
      }

      const scores = await db.query.gameScores.findMany({
        where: eq(gameScores.gameType, params.game),
        orderBy: desc(gameScores.score),
        limit,
        with: {
          user: {
            columns: {
              id: true,
            },
          },
        },
      });

      return { scores };
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      return status(500, "Failed to fetch leaderboard");
    }
  }, {
    params: t.Object({ game: t.String() }),
    query: t.Object({ limit: t.Optional(t.String()) }),
    response: {
      200: t.Object({
        scores: t.Array(t.Object({
          id: t.Integer(),
          userId: t.String(),
          gameType: t.Union([t.Literal("2048"), t.Literal("snake"), t.Literal("flappybird")]),
          score: t.Integer(),
          time: t.Integer(),
          user: t.Object({ id: t.String() }),
        })),
      }),
      400: t.String(),
      500: t.String(),
    },
  });

export default games;
