import express from "express";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import planRouter from "./routes/plan.route";
import clientRouter from "./routes/client.route";
import connectionPointRouter from "./routes/connectionPoint.route";

dotenv.config();
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/planos", planRouter);
app.use("/clientes", clientRouter);
app.use("/ponto-conexao", connectionPointRouter);
app.use("/", async (req, res) => {
  res.send("Server running index");
});

app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Rota ${req.method} ${req.path} não encontrada.` });
});

server.listen(port, () => {
  console.log("Servidor rodando na porta " + port);
});
