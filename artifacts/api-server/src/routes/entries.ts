import { Router, type IRouter } from "express";
import { db, entriesTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import {
  CreateEntryBody,
  DeleteEntryParams,
  DeleteEntryResponse,
} from "@workspace/api-zod";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "dispatch2024";

const router: IRouter = Router();

router.get("/entries", async (req, res) => {
  const entries = await db
    .select()
    .from(entriesTable)
    .orderBy(desc(entriesTable.createdAt));

  res.json(entries.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() })));
});

router.post("/entries", async (req, res) => {
  const body = CreateEntryBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { adminPassword, ...entryData } = body.data;
  if (adminPassword !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [entry] = await db
    .insert(entriesTable)
    .values(entryData)
    .returning();

  res.status(201).json({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
  });
});

router.delete("/entries/:id", async (req, res) => {
  const params = DeleteEntryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const adminPassword = req.body?.adminPassword ?? req.headers["x-admin-password"];
  if (adminPassword !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  await db.delete(entriesTable).where(eq(entriesTable.id, params.data.id));

  const result = DeleteEntryResponse.parse({ success: true, message: "Deleted" });
  res.json(result);
});

export default router;
