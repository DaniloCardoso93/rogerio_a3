import { Router } from "express";
import {ProdutoController}  from "../controller/produto.controller";




const router = Router();
const produtoController = new ProdutoController();

router.post("/create", produtoController.create);
router.get("/all", produtoController.list);
router.get("/:id",produtoController.findById)
router.delete("/:id", produtoController.delete);
router.get("/cliente/:clienteId",produtoController.findByCliente)
router.put("/update/:id", produtoController.update)

export { router as produtoRoutes };