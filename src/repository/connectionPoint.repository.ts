import { prisma } from "../config/prisma";

export const connectionPointRepository = {
  getByLoginMk: async (loginMk: string) => {
    return await prisma.pontoConexao.findUnique({
      where: { loginMk },
    });
  },
};
