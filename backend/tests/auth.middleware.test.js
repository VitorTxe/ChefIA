import { jest, describe, it, expect, beforeEach } from '@jest/globals';

process.env.JWT_SECRET = 'secret_para_testes_unitarios_123';

const mockJwt = {
  verify: jest.fn(),
};

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: mockJwt,
}));

const { default: authMiddleware } = await import('../src/middlewares/auth.js');

const createMockContext = () => {
  const req = {
    cookies: {},
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  const next = jest.fn();

  return { req, res, next };
};

describe('authMiddleware (src/middlewares/auth.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar status 401 quando nenhum token for fornecido nos cookies', () => {
    const { req, res, next } = createMockContext();
    req.cookies = {};

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar status 401 quando o token JWT for inválido ou expirado', () => {
    const { req, res, next } = createMockContext();
    req.cookies = { token: 'token_invalido_ou_adulterado' };

    mockJwt.verify.mockImplementation(() => {
      throw new Error('TokenExpiredError');
    });

    authMiddleware(req, res, next);

    expect(mockJwt.verify).toHaveBeenCalledWith('token_invalido_ou_adulterado', process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve decodificar o token com sucesso, preencher req.userId e req.userUsuario e chamar next()', () => {
    const { req, res, next } = createMockContext();
    req.cookies = { token: 'token_valido_jwt' };

    const payloadDecodificado = {
      userId: 'user-id-123',
      usuario: 'chefvitor',
    };
    mockJwt.verify.mockReturnValue(payloadDecodificado);

    authMiddleware(req, res, next);

    expect(mockJwt.verify).toHaveBeenCalledWith('token_valido_jwt', process.env.JWT_SECRET);
    expect(req.userId).toBe('user-id-123');
    expect(req.userUsuario).toBe('chefvitor');
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
