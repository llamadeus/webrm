import { z } from "zod";
import { sync } from "~/lib/sync";
import { AuthState } from "~/lib/xapi";
import { endpoint } from "~/lib/xapi/builder/endpoint";
import { Table } from "~/models";


export const createTable = endpoint({
  method: "PUT",
  route: "/tables",
  auth: AuthState.Admin,
  input: z.object({
    name: z.string().min(1).max(50),
  }),
  output: z.object({
    status: z.string(),
  }),
  handler: async ({ input, session }) => {
    const table = await Table.create({
      restaurantId: session.auth.restaurantId,
      name: input.name.trim(),
    });

    sync.publish(session.auth.restaurantId, {
      type: "table-created",
      data: {
        id: table.id,
        name: table.name,
        createdAt: table.createdAt.toISOString(),
      },
    });

    return {
      status: "success",
    };
  },
});
