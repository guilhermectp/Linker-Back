import express from "express";
import { clientController } from "../controllers/client.controller";
import { validate } from "../middleware/validate.middleware";
import {
  createClientSchema,
  updatePersonalInfoSchema,
  updateCustomerCentralPasswordSchema,
} from "../schema/client.schema";

const clientRouter = express.Router();

clientRouter.get("/", clientController.getAllClient);

clientRouter.get("/:idCliente", clientController.getById);

clientRouter.post(
  "/",
  validate(createClientSchema),
  clientController.createClient,
);

clientRouter.patch(
  "/atualizar/:idCliente",
  validate(updatePersonalInfoSchema),
  clientController.updatePersonalInfo,
);

clientRouter.put(
  "/atualizar-senha/:idCliente",
  validate(updateCustomerCentralPasswordSchema),
  clientController.updateCustomerCentralPassword,
);

// clientRouter.put(
//   "/atualizar-ponto/:idCliente/:idPontoConexao",
//   validate(updateConnectionPoint),
//   clientController.updateConnectionPoint,
// );

export default clientRouter;
