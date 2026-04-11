import express from "express";
import { clientController } from "../controllers/client.controller";
import { validate } from "../middleware/validate.middleware";
import {
  clientCreateFullSchema,
  clientUpdateInfoSchema,
  clientUpdatePasswordSchema,
} from "../schema/client.schema";

const clientRouter = express.Router();

clientRouter.get("/", clientController.getAll);

clientRouter.get("/:idCliente", clientController.getById);

clientRouter.post(
  "/",
  validate(clientCreateFullSchema),
  clientController.create,
);

clientRouter.patch(
  "/atualizar/:idCliente",
  validate(clientUpdateInfoSchema),
  clientController.updatePersonalInfo,
);

clientRouter.put(
  "/atualizar-senha/:idCliente",
  validate(clientUpdatePasswordSchema),
  clientController.updateCustomerCentralPassword,
);

export default clientRouter;
