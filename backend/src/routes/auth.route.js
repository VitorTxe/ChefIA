import express from "express"
import { cadastrarUsuario, loginUsuario, usuario, verificarSessao, logoutUsuario } from "../controllers/authController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router()

router.post('/login', loginUsuario)
router.post('/cadastrar', cadastrarUsuario)
// Rota para o frontend checar se a sessão (cookie) ainda é válida
router.get('/me', authMiddleware, verificarSessao)
// Rota de logout
router.post('/logout', logoutUsuario)

export default router 
