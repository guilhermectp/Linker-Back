import { planIntegration } from "../integration/plan.integration";
import { planRepository } from "../repository/plan.repository";
import {
  TCreatePlanInput,
  TMikrotikPlan,
  TUpdatePlanInput,
} from "../schema/plan.schema";

const convertToKbps = (value: number): string => {
  return `${value * 1024}k`;
};

export const planService = {
  async getAllPlan() {
    return await planRepository.getAllPlan();
  },

  async createPlan(planData: TCreatePlanInput) {
    const mkPlan: TMikrotikPlan = {
      name: planData.nome,
      "rate-limit": `${convertToKbps(planData.uploadMB)}/${convertToKbps(planData.downloadMB)}`,
      comment: planData.descricao,
    };

    const { error: mkError } = await planIntegration.createPlan(mkPlan);
    if (mkError) return { data: null, error: mkError };

    try {
      const dbData = await planRepository.createPlan(planData);
      return { data: dbData, error: null };
    } catch (dbError) {
      await planIntegration.deletePlan(planData.nome);
      return {
        data: null,
        error: "Erro no banco, MikroTik revertido.",
      };
    }
  },

  async updatePlan(planData: TUpdatePlanInput) {
    const currentPlan = await planRepository.getPlanByName(planData.nome);

    if (!currentPlan) {
      return { data: null, error: { message: "Plano não encontrado." } };
    }

    const updatedData: TCreatePlanInput = {
      nome: planData.nome,
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

    const { error: mkError } = await planIntegration.updatePlan(mkPlan);
    if (mkError) return { data: null, error: mkError };

    try {
      const dbData = await planRepository.updatePlan(updatedData);
      return { data: dbData, error: null };
    } catch (dbError) {
      return {
        data: null,
        error: "Erro no banco, MikroTik não revertido.",
      };
    }
  },

  async deletePlan(planName: string) {
    return await planRepository.deletePlan(planName);
  },
};
