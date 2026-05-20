import express from "express";
import receitasRoutes from './src/routes/receitas.route.js'
import authRoutes from './src/routes/auth.route.js'
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

const app = express();

const port = process.env.PORT || 3001;

const corsOptions = {
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'authorization'],
    // Necessário para o browser enviar cookies automaticamente nas requisições
    credentials: true
}

// Configuração do Rate Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 10, // Limite de requisições por IP a cada 15 minutos
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: "Muitas requisições. Por favor, tente novamente mais tarde." }
});

// Habilita o CORS
app.use(cors(corsOptions))

// Aplica o rate limit em todas as rotas
app.use(limiter);

// Habilita o body parser para JSON
app.use(express.json())

// Habilita a leitura de cookies nas requisições
app.use(cookieParser());

// helmet ajuda a proteger o servidor contra ataques XSS e clickjacking
app.use(helmet());

app.use('/api/auth', authRoutes)
app.use('/api/receitas', receitasRoutes)

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})
