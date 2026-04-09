import express from "express";
import { validate } from "../middleware/validate.middleware";
import { connectionPointController } from "../controllers/connectionPoint.controller";
import {
  createConnectionPointSchema,
  updateConnectionPointSchema,
} from "../schema/pointConnection.schema";

const connectionPointRouter = express.Router();

connectionPointRouter.post(
  "/:idCliente",
  validate(createConnectionPointSchema),
  connectionPointController.create,
);

connectionPointRouter.patch(
  "/:idPontoConexao",
  validate(updateConnectionPointSchema),
  connectionPointController.update,
);

export default connectionPointRouter;
