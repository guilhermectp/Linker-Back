import { planController } from "../controllers/plan.controller";
import express from "express";
import { validate } from "../middleware/validate.middleware";
import { createPlanSchema, updatePlanSchema } from "../schema/plan.schema";

const planRouter = express.Router();

planRouter.get("/", planController.getAllPlan);
planRouter.post("/", validate(createPlanSchema), planController.createPlan);
planRouter.patch(
  "/:nome",
  validate(updatePlanSchema),
  planController.updatePlan,
);
planRouter.delete("/:nome", planController.deletePlan);

export default planRouter;
