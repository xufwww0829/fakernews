import { Elysia, t } from "elysia";
import { InsertUser, UpdateUserKarma, SelectUser } from "./schema";
import { getUserById, getUserItems, createUser, updateUserKarma } from "./service";
import { getUserFavorites } from "../item/service";

export const user = new Elysia({ prefix: "/user" })
  .get("/:id", getUserById,
    {
      params: t.Object({ id: t.String() }),
      response: {
        200: SelectUser,
        404: t.String(),
      }
    }
  )
  .get("/:id/items", getUserItems,
    {
      params: t.Object({ id: t.String() }),
      query: t.Object({
        type: t.Optional(t.Union([
          t.Literal("story"),
          t.Literal("comment"),
          t.Literal("job"),
        ])),
      }),
      response: {
        200: t.Array(t.Object({
          id: t.Integer(),
          type: t.String(),
          time: t.Integer(),
          title: t.Optional(t.String()),
          text: t.Optional(t.String()),
          url: t.Optional(t.String()),
          score: t.Integer(),
          parent: t.Optional(t.Integer()),
        })),
        404: t.String(),
      }
    }
  )
  .post("/", createUser,
    {
      body: InsertUser,
      response: {
        200: SelectUser,
        409: t.String(),
      }
    }
  )
  .patch("/:id/karma", updateUserKarma,
    {
      params: t.Object({ id: t.String() }),
      body: UpdateUserKarma,
      response: {
        200: SelectUser,
        404: t.String(),
      }
    }
  )
  .get("/:id/favorites", getUserFavorites,
    {
      params: t.Object({ id: t.String() }),
      response: {
        200: t.Array(t.Object({
          id: t.Integer(),
          type: t.String(),
          time: t.Integer(),
          title: t.Optional(t.String()),
          text: t.Optional(t.String()),
          url: t.Optional(t.String()),
          score: t.Integer(),
          parent: t.Optional(t.Integer()),
          favoritedAt: t.Integer(),
        })),
        404: t.String(),
      }
    }
  );