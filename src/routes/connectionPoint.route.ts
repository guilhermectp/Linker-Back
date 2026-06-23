import express from "express";
import { validate } from "../middleware/validate.middleware";
import { connectionPointController } from "../controllers/connectionPoint.controller";
import {
  connectionPointAddressSchema,
  connectionPointFullSchema,
  connectionPointPlanSchema,
  connectionPointUpdateMicrotikSchema,
} from "../schema/connectionPoint.schema";

const connectionPointRouter = express.Router();

connectionPointRouter.post(
  "/:idCliente",
  validate(connectionPointFullSchema),
  connectionPointController.create,
);

connectionPointRouter.patch(
  "/plano/:idPontoConexao",
  validate(connectionPointPlanSchema),
  connectionPointController.updatePlan,
);

connectionPointRouter.patch(
  "/microtik/:idPontoConexao",
  validate(connectionPointUpdateMicrotikSchema),
  connectionPointController.updateMicrotik,
);

connectionPointRouter.patch(
  "/endereco/:idPontoConexao",
  validate(connectionPointAddressSchema),
  connectionPointController.updateAddress,
);

connectionPointRouter.delete(
  "/:idPontoConexao",
  connectionPointController.delete,
);

export default connectionPointRouter;
