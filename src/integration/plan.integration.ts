import { IMikrotikPlan } from "../types/plan";
import { useApi } from "./useApi";

export const planIntegration = {
  async createPlan(planData: IMikrotikPlan) {
    console.log("Creating plan in MikroTik:", planData);
    return await useApi("/ppp/profile", {
      method: "PUT",
      data: planData,
    });
  },

  async getAllPlans() {
    return await useApi("/ppp/profile");
  },

  async updatePlan(planData: IMikrotikPlan) {
    return await useApi(`/ppp/profile/${planData.name}`, {
      method: "PATCH",
      data: planData,
    });
  },

  async deletePlan(planName: string) {
    return await useApi(`/ppp/profile/${planName}`, {
      method: "DELETE",
    });
  },
};
