import prisma from '../lib/prisma.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const cadastrarUsuario = async (req, res) => {
    const { usuario, password } = req.body;

    try {
        // Verifica se o usuário já existe no banco de dados
        const usuarioExistente = await prisma.user.findUnique({
            where: {
                usuario: usuario,
            },
        });

        // Se o usuário existir, retorna um erro 409 (conflito)
        if (usuarioExistente) {
            return res.status(409).json({ error: "Este nome de usuário já está em uso." });
        }

        // Criptografa a senha antes de salvar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Se não existir, cria o novo usuário
        const novoUsuario = await prisma.user.create({
            data: {
                usuario: usuario,
                password: hashedPassword,
            },
            select: {
                id: true,
                usuario: true,
            }
        });
        // Retorna o novo usuário criado (sem a senha)
        return res.status(201).json(novoUsuario);
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).json({ error: "Ocorreu um erro interno ao cadastrar o usuário." });
    }
}

export const loginUsuario = async (req, res) => {
    const { usuario, password } = req.body;

    try {
        // Encontra o usuário pelo nome de usuário
        const user = await prisma.user.findUnique({
            where: { usuario },
        });

        // Se o usuário não for encontrado, retorna erro de "Usuario nao existe"
        if (!user) {
            return res.status(401).json({ error: "Usuário não existe." });
        }

        // Compara a senha enviada com a senha criptografada no banco
        const isMatch = await bcrypt.compare(password, user.password);

        // Se as senhas não baterem, retorna erro
        if (!isMatch) {
            return res.status(401).json({ error: "Senha inválida." });
        }

        // Gerar o token JWT
        const token = jwt.sign(
            { userId: user.id, usuario: user.usuario },
            process.env.JWT_SECRET,
            { expiresIn: "300s" }
        );

        // Se tudo estiver correto, envia o token como cookie HttpOnly
        res.cookie('token', token, {
            httpOnly: true,   // Impede acesso via JavaScript (protége contra XSS)
            secure: process.env.NODE_ENV === 'production', // Apenas HTTPS em produção
            sameSite: 'strict', // Protege contra ataques CSRF
            maxAge: 300000    // 5 minutos em milissegundos
        });

        return res.status(200).json({ message: "Login bem-sucedido!" });
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        return res.status(500).json({ error: "Ocorreu um erro interno ao fazer login." });
    }
};

export const usuario = async (req, res) => {
    let users = []

    try {
        users = await prisma.user.findMany({
            select : {
                id: true,
                usuario: true
            }
        })
    } catch (error) {
        console.log(error)
    }
    res.status(200).json(users)
}

// Rota usada pelo frontend para verificar se a sessão ainda é válida
// O authMiddleware já valida o cookie. Se chegar aqui, o usuário está autenticado.
export const verificarSessao = (req, res) => {
    res.status(200).json({ autenticado: true, usuario: req.userUsuario });
};