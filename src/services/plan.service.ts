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

const buildMkPlan = (data: TCreatePlanInput): TMikrotikPlan => ({
  name: data.nome,
  "rate-limit": `${convertToKbps(data.uploadMB)}/${convertToKbps(data.downloadMB)}`,
  comment: data.descricao,
});

export const planService = {
  getAllPlan: async () => {
    const plans = await planRepository.getAllPlan();

    if (plans.length === 0)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Nenhum plano encontrado.",
      );

    const aux = plans.map((plan) => ({
      ...plan,
      valor: Number(plan.valor),
    }));

    return serviceSuccess(aux);
  },

  createPlan: async (planData: TCreatePlanInput) => {
    const exists = await planRepository.getPlanByName(planData.nome);
    if (exists)
      return serviceError(ServiceErrorCode.CONFLICT, "Este plano já existe.");

    let dbData;
    try {
      dbData = await planRepository.createPlan(planData);
    } catch {
      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao salvar plano no banco de dados.",
      );
    }

    try {
      await planIntegration.createPlan(buildMkPlan(planData));
    } catch (error) {
      await planRepository.deletePlan(planData.nome).catch(() => null);

      if (error instanceof Error && error.message.includes("timeout"))
        return serviceError(
          ServiceErrorCode.INTERNAL_ERROR,
          "Servidor MikroTik não respondeu.",
        );

      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao criar plano no MikroTik.",
      );
    }

    return serviceSuccess(dbData, true);
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
      descricao: planData.descricao ?? currentPlan.descricao,
    };

    const rollbackData: TCreatePlanInput = {
      nome: currentPlan.nome,
      uploadMB: currentPlan.uploadMB,
      downloadMB: currentPlan.downloadMB,
      valor: Number(currentPlan.valor),
      descricao: currentPlan.descricao,
    };

    let dbData;
    try {
      dbData = await planRepository.updatePlan(currentPlan.nome, updatedData);
    } catch {
      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao atualizar plano no banco de dados.",
      );
    }

    try {
      await planIntegration.updatePlan(
        currentPlan.nome,
        buildMkPlan(updatedData),
      );
    } catch (error) {
      await planRepository
        .updatePlan(updatedData.nome, rollbackData)
        .catch(() => null);

      if (error instanceof Error && error.message.includes("timeout"))
        return serviceError(
          ServiceErrorCode.INTERNAL_ERROR,
          "Servidor MikroTik não respondeu.",
        );

      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao atualizar plano no MikroTik.",
      );
    }

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

    try {
      await planRepository.deletePlan(planName);
    } catch {
      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao deletar plano do banco de dados.",
      );
    }

    try {
      await planIntegration.deletePlan(planName);
    } catch (error) {
      await planRepository
        .createPlan({
          nome: plan.nome,
          uploadMB: plan.uploadMB,
          downloadMB: plan.downloadMB,
          valor: Number(plan.valor),
          descricao: plan.descricao,
        })
        .catch(() => null);

      if (error instanceof Error && error.message.includes("timeout"))
        return serviceError(
          ServiceErrorCode.INTERNAL_ERROR,
          "Servidor MikroTik não respondeu.",
        );

      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao deletar plano no MikroTik.",
      );
    }

    return serviceSuccess({ message: "Deletado com sucesso." });
  },
};
