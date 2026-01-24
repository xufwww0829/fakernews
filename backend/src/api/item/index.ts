import { Elysia, t } from "elysia";
import { InsertItem, SelectItem } from "./schema";
import {
  deleteItem,
  getItemById,
  insertItem,
  voteItem,
  checkUpvoteStatus,
  checkMultipleUpvoteStatus,
  toggleFavorite,
  checkFavoriteStatus,
  checkMultipleFavoriteStatus,
  getUserFavorites,
} from "./service";

export const item = new Elysia({ prefix: "/item" })
  .get("/:id", getItemById,
    {
      params: t.Object({ id: t.Integer() }),
      response: {
        200: SelectItem,
        404: t.String(),
      }
    }
  )
  .post("/", insertItem,
    {
      body: InsertItem,
      response: {
        200: SelectItem
      }
    })
  .post("/items/:id/vote", voteItem,
    {
      params: t.Object({ id: t.Integer() }),
      body: t.Object({
        type: t.Union([t.Literal("up"), t.Literal("down")]),
        userId: t.String()
      })
    })
  .get("/items/:id/upvote", checkUpvoteStatus,
    {
      params: t.Object({ id: t.Integer() }),
      query: t.Object({ userId: t.String() }),
      response: {
        200: t.Object({
          upvoted: t.Boolean()
        })
      }
    })
  .post("/items/upvotes/check", checkMultipleUpvoteStatus,
    {
      body: t.Object({
        userId: t.String(),
        itemIds: t.Array(t.Integer())
      }),
      response: {
        200: t.Record(t.String(), t.Boolean())
      }
    })
  .route("DELETE", "/:id", deleteItem,
    {
      params: t.Object({ id: t.Integer() }),
    })
  // Favorite endpoints
  .post("/items/:id/favorite", toggleFavorite,
    {
      params: t.Object({ id: t.Integer() }),
      body: t.Object({
        userId: t.String()
      }),
      response: {
        200: t.Object({
          id: t.Integer(),
          favorited: t.Boolean()
        }),
        401: t.String(),
      }
    })
  .get("/items/:id/favorite", checkFavoriteStatus,
    {
      params: t.Object({ id: t.Integer() }),
      query: t.Object({ userId: t.String() }),
      response: {
        200: t.Object({
          favorited: t.Boolean()
        })
      }
    })
  .post("/items/favorites/check", checkMultipleFavoriteStatus,
    {
      body: t.Object({
        userId: t.String(),
        itemIds: t.Array(t.Integer())
      }),
      response: {
        200: t.Record(t.String(), t.Boolean())
      }
    });
