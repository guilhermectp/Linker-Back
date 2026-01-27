import { planController } from "../controllers/plan.controller";
import express from "express";
import { validate } from "../middleware/validate.middleware";
import { createPlanSchema, updatePlanSchema } from "../schema/plan.schema";

const router = express.Router();

router.get("/", planController.getAllPlan);
router.post("/", validate(createPlanSchema), planController.createPlan);
router.put("/", validate(updatePlanSchema), planController.updatePlan);
router.delete("/", planController.deletePlan);

export default router;
