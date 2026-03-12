import { planIntegration } from "../integration/plan.integration";
import { planRepository } from "../repository/plan.repository";
import {
  TCreatePlanInput,
  TMikrotikPlan,
  TUpdatePlanInput,
} from "../schema/plan.schema";
import {
  ServiceErrorCode,
  serviceError,
  serviceSuccess,
} from "../utils/service-response";

const convertToKbps = (value: number): string => `${value * 1024}k`;

export const planService = {
  getAllPlan: async () => {
    const plans = await planRepository.getAllPlan();

    if (plans.length === 0)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Nenhum plano encontrado.",
      );

    return serviceSuccess(plans);
  },

  createPlan: async (planData: TCreatePlanInput) => {
    const exists = await planRepository.getPlanByName(planData.nome);

    if (exists)
      return serviceError(ServiceErrorCode.CONFLICT, "Este plano já existe.");

    const mkPlan: TMikrotikPlan = {
      name: planData.nome,
      "rate-limit": `${convertToKbps(planData.uploadMB)}/${convertToKbps(planData.downloadMB)}`,
      comment: planData.descricao,
    };

    try {
      await planIntegration.createPlan(mkPlan);
      const dbData = await planRepository.createPlan(planData);
      return serviceSuccess(dbData, true); // 201
    } catch (error) {
      await planIntegration.deletePlan(planData.nome).catch(() => null);

      if (error instanceof Error && error.message.includes("timeout")) {
        return serviceError(
          ServiceErrorCode.INTERNAL_ERROR,
          "Servidor Mikrotik não respondeu. Tente novamente.",
        );
      }

      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao criar plano no Mikrotik.",
      );
    }
  },

  updatePlan: async (originalName: string, planData: TUpdatePlanInput) => {
    const currentPlan = await planRepository.getPlanByName(originalName);

    if (!currentPlan)
      return serviceError(ServiceErrorCode.NOT_FOUND, "Plano não encontrado.");

    const updatedData: TCreatePlanInput = {
      nome: planData.nome ?? currentPlan.nome,
      uploadMB: planData.uploadMB ?? currentPlan.uploadMB,
      downloadMB: planData.downloadMB ?? currentPlan.downloadMB,
      valor: planData.valor ?? Number(currentPlan.valor),
      descricao: planData.descricao ?? currentPlan.descricao ?? undefined,
    };

    const mkPlan: TMikrotikPlan = {
      name: updatedData.nome,
      "rate-limit": `${convertToKbps(updatedData.uploadMB)}/${convertToKbps(updatedData.downloadMB)}`,
      comment: updatedData.descricao,
    };

    await planIntegration.updatePlan(currentPlan.nome, mkPlan);
    const dbData = await planRepository.updatePlan(
      currentPlan.nome,
      updatedData,
    );

    return serviceSuccess(dbData);
  },

  deletePlan: async (planName: string) => {
    const plan = await planRepository.getPlanByName(planName);

    if (!plan)
      return serviceError(ServiceErrorCode.NOT_FOUND, "Plano não existe.");

    const usage = await planRepository.countUsage(plan.id);

    if (usage > 0)
      return serviceError(
        ServiceErrorCode.CONFLICT,
        "Plano em uso por clientes ativos.",
      );

    await planIntegration.deletePlan(planName);
    await planRepository.deletePlan(planName);

    return serviceSuccess({ message: "Deletado com sucesso." });
  },
};
