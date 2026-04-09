import { useApi } from "./useApi";

type TMikrotikPPPoEUser = {
  name: string;
  password: string;
  profile: string; // nome do plano no MK
  service: "pppoe";
};

export const clientIntegration = {
  create: async (data: TMikrotikPPPoEUser) => {
    return await useApi("/ppp/secret", {
      method: "PUT",
      data,
    });
  },

  delete: async (loginMk: string) => {
    return await useApi(`/ppp/secret/${loginMk}`, {
      method: "DELETE",
    });
  },

  update: async (loginMk: string, data: Partial<TMikrotikPPPoEUser>) => {
    return await useApi(`/ppp/secret/${loginMk}`, {
      method: "PATCH",
      data,
    });
  },
};
