import { Elysia, t } from "elysia";
import { InsertItem, SelectItem } from "./schema";
import { deleteItem, getItemById, insertItem, voteItem } from "./service";

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
      body: t.Object({ type: t.Union([t.Literal("up"), t.Literal("down")]) })
    })
  .route("DELETE", "/:id", deleteItem,
    {
      params: t.Object({ id: t.Integer() }),
    });
