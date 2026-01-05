import { t } from "elysia";

export const SelectUser = t.Object({
  id: t.String({
    title: "User ID",
    description: "Unique identifier of the user",
  }),
  created: t.Integer({
    title: "Created Time",
    description: "Unix timestamp (milliseconds) when user was created",
  }),
  karma: t.Integer({
    title: "Karma",
    description: "User's karma score",
  }),
  about: t.Optional(
    t.String({
      title: "About",
      description: "User's bio or description",
    }),
  ),
}, {
  title: "User",
  description: "A user returned from storage",
});

export type SelectUser = typeof SelectUser.static;

export const InsertUser = t.Object({
  id: t.String({
    title: "User ID",
    description: "Unique identifier of the user",
  }),
  about: t.Optional(
    t.String({
      title: "About",
      description: "User's bio or description",
    }),
  ),
}, {
  title: "Insert User",
  description: "Payload for creating a user",
});

export type InsertUser = typeof InsertUser.static;

export const UpdateUserKarma = t.Object({
  delta: t.Integer({
    title: "Karma Delta",
    description: "Change in karma (positive or negative)",
  }),
}, {
  title: "Update Karma",
  description: "Payload for updating user karma",
});

export type UpdateUserKarma = typeof UpdateUserKarma.static;