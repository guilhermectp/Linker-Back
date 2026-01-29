import { planIntegration } from "../integration/plan.integration";
import { planRepository } from "../repository/plan.repository";
import {
  TCreatePlanInput,
  TMikrotikPlan,
  TUpdatePlanInput,
} from "../schema/plan.schema";
import {
  ServiceResponseType,
  TServiceResponse,
} from "../utils/service-response";

const convertToKbps = (value: number): string => {
  return `${value * 1024}k`;
};

export const planService = {
  getAllPlan: async () => {
    const plans = await planRepository.getAllPlan();

    if (plans.length === 0) {
      return {
        type: ServiceResponseType.NOT_FOUND,
        error: "Nenhum plano encontrado.",
      };
    }

    return { type: ServiceResponseType.SUCCESS, data: plans };
  },

  createPlan: async (planData: TCreatePlanInput) => {
    const exists = await planRepository.getPlanByName(planData.nome);
    if (exists)
      return {
        type: ServiceResponseType.CONFLICT,
        error: "Este plano já existe.",
      };

    const mkPlan: TMikrotikPlan = {
      name: planData.nome,
      "rate-limit": `${convertToKbps(planData.uploadMB)}/${convertToKbps(planData.downloadMB)}`,
      comment: planData.descricao,
    };

    try {
      await planIntegration.createPlan(mkPlan);
      const dbData = await planRepository.createPlan(planData);
      return { type: ServiceResponseType.CREATED, data: dbData };
    } catch (error) {
      await planIntegration.deletePlan(planData.nome);
      throw error;
    }
  },

  updatePlan: async (originalName: string, planData: TUpdatePlanInput) => {
    let originalPlan = undefined;

    try {
      const currentPlan = await planRepository.getPlanByName(originalName);
      if (!currentPlan)
        return {
          type: ServiceResponseType.NOT_FOUND,
          error: "Plano não encontrado.",
        };

      originalPlan = { ...currentPlan };

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

      await planIntegration.updatePlan(originalPlan.nome, mkPlan);
      const dbData = await planRepository.updatePlan(
        originalPlan.nome,
        updatedData,
      );
      return { type: ServiceResponseType.SUCCESS, data: dbData };
    } catch (error) {
      throw error;
    }
  },

  deletePlan: async (planName: string): Promise<TServiceResponse> => {
    try {
      const plan = await planRepository.getPlanByName(planName);
      if (!plan)
        return {
          type: ServiceResponseType.NOT_FOUND,
          error: "Plano não existe.",
        };

      const usage = await planRepository.countUsage(plan.id);
      if (usage > 0)
        return {
          type: ServiceResponseType.CONFLICT,
          error: "Plano em uso por clientes ativos.",
        };

      await planIntegration.deletePlan(planName);
      await planRepository.deletePlan(planName);

      return {
        type: ServiceResponseType.SUCCESS,
        data: "Deletado com sucesso.",
      };
    } catch (error) {
      throw error;
    }
  },
};
