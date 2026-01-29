import { TMikrotikPlan } from "../schema/plan.schema";
import { useApi } from "./useApi";

export const planIntegration = {
  createPlan: async (planData: TMikrotikPlan) => {
    return await useApi("/ppp/profile", {
      method: "PUT",
      data: planData,
    });
  },

  getAllPlans: async () => {
    return await useApi("/ppp/profile");
  },

  updatePlan: async (originalName: string, planData: TMikrotikPlan) => {
    return await useApi(`/ppp/profile/${originalName}`, {
      method: "PATCH",
      data: planData,
    });
  },

  deletePlan: async (planName: string) => {
    return await useApi(`/ppp/profile/${planName}`, {
      method: "DELETE",
    });
  },
};
