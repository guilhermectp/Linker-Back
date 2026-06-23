import { useApi } from "./useApi";

type TMikrotikPPPoEUser = {
  name: string;
  password: string;
  profile: string;
  service: "pppoe";
};

export const clientIntegration = {
  create: async (data: TMikrotikPPPoEUser) => {
    return await useApi("/ppp/secret", {
      method: "PUT",
      data,
    });
  },

  getIdByName: async (loginMk: string): Promise<string> => {
    const results = await useApi(`/ppp/secret?name=${loginMk}`);
    if (!results || results.length === 0) {
      throw new Error(`Usuário "${loginMk}" não encontrado no MikroTik`);
    }
    return results[0][".id"];
  },

  delete: async (loginMk: string) => {
    const id = await clientIntegration.getIdByName(loginMk);
    return await useApi(`/ppp/secret/${id}`, {
      method: "DELETE",
    });
  },

  update: async (loginMk: string, data: Partial<TMikrotikPPPoEUser>) => {
    const id = await clientIntegration.getIdByName(loginMk);
    return await useApi(`/ppp/secret/${id}`, {
      method: "PATCH",
      data,
    });
  },
};
