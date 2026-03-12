import express from "express";
import { clientController } from "../controllers/client.controller";
import { validate } from "../middleware/validate.middleware";
import {
  createClientSchema,
  updateClientSchema,
  updateConnectionPoint,
} from "../schema/client.schema";

const clientRouter = express.Router();

clientRouter.get("/", clientController.getAllClient);

clientRouter.get("/:idCliente", clientController.getById);

clientRouter.post(
  "/",
  validate(createClientSchema),
  clientController.createClient,
);

clientRouter.put(
  "/atualizar/:idCliente",
  validate(updateClientSchema),
  clientController.updatePersonalInfo,
);

clientRouter.put(
  "/atualizar-ponto/:idCliente/:idPontoConexao",
  validate(updateConnectionPoint),
  clientController.updateConnectionPoint,
);

export default clientRouter;
