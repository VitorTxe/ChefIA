import express from "express"
import { cadastrarUsuario, loginUsuario, usuario, verificarSessao, logoutUsuario } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.js";
import { health } from "../controllers/health.controller.js";

const router = express.Router()

router.post('/login', loginUsuario)
router.post('/cadastrar', cadastrarUsuario)
// Rota para o frontend checar se a sessão (cookie) ainda é válida
// Rota de logout
router.post('/logout', logoutUsuario)
router.get('/user', usuario)
router.get('/me', authMiddleware, verificarSessao)
router.get('/health', health)


export default router 
