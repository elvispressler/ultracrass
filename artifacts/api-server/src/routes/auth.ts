import { Router, type IRouter } from "express";
import { VerifyPasswordBody, VerifyPasswordResponse } from "@workspace/api-zod";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "dispatch2024";

const router: IRouter = Router();

router.post("/auth/verify", (req, res) => {
  const body = VerifyPasswordBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const result = VerifyPasswordResponse.parse({ valid: body.data.password === ADMIN_PASSWORD });
  res.json(result);
});

export default router;
