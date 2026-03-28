import { Router, type IRouter } from "express";
import healthRouter from "./health";
import entriesRouter from "./entries";
import themeRouter from "./theme";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(entriesRouter);
router.use(themeRouter);
router.use(authRouter);

export default router;
