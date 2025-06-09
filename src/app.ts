import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { clienteRoutes } from "./routes/routes";
import { produtoRoutes } from "./routes/route.produto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/clientes", clienteRoutes);
app.use("/api/produtos", produtoRoutes)

AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com banco de dados estabelecida!");

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar com o banco de dados:", error);
  });
