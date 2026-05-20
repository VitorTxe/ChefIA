import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
    // Lê o token direto do cookie HttpOnly (enviado automaticamente pelo browser)
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        req.userUsuario = decoded.usuario;

        return next();
        
    } catch (err) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}