import { planController } from "../controllers/plan.controller";
import express from "express";
import { validate } from "../middleware/validate.middleware";
import { createPlanSchema, updatePlanSchema } from "../schema/plan.schema";

const planRouter = express.Router();

planRouter.get("/", planController.getAll);
planRouter.post("/", validate(createPlanSchema), planController.create);
planRouter.patch("/:nome", validate(updatePlanSchema), planController.update);
planRouter.delete("/:nome", planController.deletePlan);

export default planRouter;
