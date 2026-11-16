import prisma from '../lib/prisma.js';

export const health = async (req, res) => {
    const pingSecret = process.env.PING_SECRET
    if (pingSecret && req.headers['x-ping-secret'] !== pingSecret) {
        return res.status(200).json({ status: 'ok' })}

    try {
        const start = performance.now()
        await prisma.$runCommandRaw({ ping: 1 }); 
        const dbLatencyMs = Math.round(performance.now() - start);

        return res.status(200).json({ status: 'ok', dbLatencyMs });
    } catch (error) {
        
    }

}