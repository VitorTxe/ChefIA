import express from "express"
import { perguntarReceita } from '../controllers/receitas.controller.js'
import authMiddleware from "../middlewares/auth.js";

const router = express.Router()

router.post('/perguntar', authMiddleware, perguntarReceita)

export default router 
