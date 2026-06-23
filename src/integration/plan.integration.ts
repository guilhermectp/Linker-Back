import { TMikrotikPlan } from "../schema/plan.schema";
import { useApi } from "./useApi";

export const planIntegration = {
  create: async (planData: TMikrotikPlan) => {
    return await useApi("/ppp/profile", {
      method: "PUT",
      data: planData,
    });
  },

  getAll: async () => {
    return await useApi("/ppp/profile");
  },

  getIdByName: async (name: string): Promise<string> => {
    const results = await useApi(`/ppp/profile?name=${name}`);
    if (!results || results.length === 0) {
      throw new Error(`Plano "${name}" não encontrado no MikroTik`);
    }
    return results[0][".id"];
  },

  update: async (originalName: string, planData: TMikrotikPlan) => {
    const id = await planIntegration.getIdByName(originalName);
    return await useApi(`/ppp/profile/${id}`, {
      method: "PATCH",
      data: planData,
    });
  },

  delete: async (planName: string) => {
    const id = await planIntegration.getIdByName(planName);
    return await useApi(`/ppp/profile/${id}`, {
      method: "DELETE",
    });
  },
};
