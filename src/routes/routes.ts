import { Router } from "express";
import { ClienteController } from "../controller/cliente.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const clienteController = new ClienteController();

router.post("/register", clienteController.create);
router.post("/login", clienteController.login);

router.get("/profile/:id", authMiddleware, clienteController.findById);
router.get("/all", authMiddleware, clienteController.findAll);
router.put("/update/:id", authMiddleware, clienteController.update);
router.delete("/delete/:id", authMiddleware, clienteController.delete);

export { router as clienteRoutes };
