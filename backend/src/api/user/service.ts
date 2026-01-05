import { status } from "elysia";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { users, items } from "@/db/schema";
import { InsertUser, UpdateUserKarma } from "./schema";

export const getUserById = async ({ params }: { params: { id: string } }) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, params.id),
  });

  if (!user) {
    return status(404, "User not found");
  }

  return {
    id: user.id,
    created: user.created,
    karma: user.karma,
    about: user.about ?? undefined,
  };
};

export const getUserItems = async ({ params, query }: {
  params: { id: string };
  query: { type?: "story" | "comment" | "job" };
}) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, params.id),
  });

  if (!user) {
    return status(404, "User not found");
  }

  const whereConditions = [eq(items.by, params.id), eq(items.deleted, false)];

  if (query.type) {
    whereConditions.push(eq(items.type, query.type));
  }

  const userItems = await db.query.items.findMany({
    where: and(...whereConditions),
    orderBy: (items, { desc }) => [desc(items.time)],
    limit: 100,
  });

  return userItems.map(item => ({
    id: item.id,
    type: item.type,
    time: item.time,
    title: item.title ?? undefined,
    text: item.text ?? undefined,
    url: item.url ?? undefined,
    score: item.score,
    parent: item.parent ?? undefined,
  }));
};

export const createUser = async ({ body }: { body: InsertUser }) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, body.id),
  });

  if (existingUser) {
    return status(409, "User already exists");
  }

  const [user] = await db.insert(users).values({
    id: body.id,
    about: body.about,
  }).returning();

  return {
    id: user.id,
    created: user.created,
    karma: user.karma,
    about: user.about ?? undefined,
  };
};

export const updateUserKarma = async ({
  params,
  body,
}: {
  params: { id: string };
  body: UpdateUserKarma;
}) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, params.id),
  });

  if (!user) {
    return status(404, "User not found");
  }

  const newKarma = Math.max(0, user.karma + body.delta);

  const [updated] = await db
    .update(users)
    .set({ karma: newKarma })
    .where(eq(users.id, params.id))
    .returning();

  return {
    id: updated.id,
    created: updated.created,
    karma: updated.karma,
    about: updated.about ?? undefined,
  };
};
