import { planIntegration } from "../integration/plan.integration";
import { planRepository } from "../repository/plan.repository";
import {
  TCreatePlanInput,
  TMikrotikPlan,
  TUpdatePlanInput,
} from "../schema/plan.schema";
import {
  serviceError,
  ServiceErrorCode,
  serviceSuccess,
} from "../utils/send-response";

const convertToKbps = (value: number): string => `${value * 1024}k`;

const buildMkPlan = (data: TCreatePlanInput): TMikrotikPlan => ({
  name: data.nome,
  "rate-limit": `${convertToKbps(data.uploadMB)}/${convertToKbps(data.downloadMB)}`,
  comment: data.descricao,
});

export const planService = {
  getAll: async () => {
    const plans = await planRepository.getAll();

    if (plans.length === 0)
      return serviceError(
        ServiceErrorCode.NOT_FOUND,
        "Nenhum plano encontrado.",
      );

    const allPlans = plans.map((plan) => ({
      ...plan,
      valor: Number(plan.valor),
    }));

    return serviceSuccess(allPlans);
  },

  create: async (planData: TCreatePlanInput) => {
    const exists = await planRepository.getPlanByName(planData.nome);
    if (exists)
      return serviceError(ServiceErrorCode.CONFLICT, "Este plano já existe.");

    let dbData;
    try {
      dbData = await planRepository.create(planData);
    } catch {
      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao salvar plano no banco de dados.",
      );
    }

    try {
      await planIntegration.create(buildMkPlan(planData));
    } catch (error) {
      await planRepository.delete(planData.nome).catch(() => null);

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

    return serviceSuccess({ message: "Plano criado.", plano: dbData }, true);
  },

  update: async (originalName: string, planData: TUpdatePlanInput) => {
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
      dbData = await planRepository.update(currentPlan.nome, updatedData);
    } catch {
      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao atualizar plano no banco de dados.",
      );
    }

    try {
      await planIntegration.update(currentPlan.nome, buildMkPlan(updatedData));
    } catch (error) {
      await planRepository
        .update(updatedData.nome, rollbackData)
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

    return serviceSuccess({ message: "Plano atualizado.", plano: dbData });
  },

  delete: async (planName: string) => {
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
      await planRepository.delete(planName);
    } catch {
      return serviceError(
        ServiceErrorCode.INTERNAL_ERROR,
        "Erro ao deletar plano do banco de dados.",
      );
    }

    try {
      await planIntegration.delete(planName);
    } catch (error) {
      await planRepository
        .create({
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

    return serviceSuccess({ message: "Plano deletado." });
  },
};
