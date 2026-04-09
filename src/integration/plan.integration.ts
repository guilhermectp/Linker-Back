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

  update: async (originalName: string, planData: TMikrotikPlan) => {
    return await useApi(`/ppp/profile/${originalName}`, {
      method: "PATCH",
      data: planData,
    });
  },

  delete: async (planName: string) => {
    return await useApi(`/ppp/profile/${planName}`, {
      method: "DELETE",
    });
  },
};
