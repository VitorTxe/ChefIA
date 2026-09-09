import { jest, describe, it, expect, beforeEach } from '@jest/globals';

process.env.JWT_SECRET = 'secret_para_testes_unitarios_123';
process.env.NODE_ENV = 'test';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

const mockBcrypt = {
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
};

const mockJwt = {
  sign: jest.fn(),
};

jest.unstable_mockModule('../src/lib/prisma.js', () => ({
  default: mockPrisma,
}));

jest.unstable_mockModule('bcrypt', () => ({
  default: mockBcrypt,
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: mockJwt,
}));

const { cadastrarUsuario, loginUsuario, verificarSessao } = await import('../src/controllers/auth.Controller.js');

const createMockContext = () => {
  const req = {
    body: {},
    cookies: {},
    params: {},
    query: {},
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
  };

  return { req, res };
};

describe('authController (src/controllers/auth.Controller.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cadastrarUsuario', () => {
    it('deve retornar status 409 quando o nome de usuário já estiver em uso', async () => {
      const { req, res } = createMockContext();
      req.body = { usuario: 'chefvitor', password: 'senhaForte123!' };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-existente-id',
        usuario: 'chefvitor',
      });

      await cadastrarUsuario(req, res);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { usuario: 'chefvitor' },
      });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Este nome de usuário já está em uso.',
      });
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it('deve criar um novo usuário com senha hasheada e retornar 201 com dados sanitizados', async () => {
      const { req, res } = createMockContext();
      req.body = { usuario: 'novo_chef', password: 'senhaSecreta123' };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockBcrypt.genSalt.mockResolvedValue('salt_gerado');
      mockBcrypt.hash.mockResolvedValue('hash_super_seguro');

      const usuarioCriado = { id: 'novo-uuid', usuario: 'novo_chef' };
      mockPrisma.user.create.mockResolvedValue(usuarioCriado);

      await cadastrarUsuario(req, res);

      expect(mockBcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('senhaSecreta123', 'salt_gerado');
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          usuario: 'novo_chef',
          password: 'hash_super_seguro',
        },
        select: {
          id: true,
          usuario: true,
        },
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(usuarioCriado);
    });

    it('deve retornar status 500 se o banco de dados falhar no cadastro', async () => {
      const { req, res } = createMockContext();
      req.body = { usuario: 'chef_falha', password: '123' };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Falha de conexão com o banco'));

      await cadastrarUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Ocorreu um erro interno ao cadastrar o usuário.',
      });
      consoleSpy.mockRestore();
    });
  });

  describe('loginUsuario', () => {
    it('deve retornar status 401 se o usuário não for encontrado', async () => {
      const { req, res } = createMockContext();
      req.body = { usuario: 'inexistente', password: 'qualquer_senha' };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      await loginUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não existe.' });
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('deve retornar status 401 quando a senha fornecida não conferir', async () => {
      const { req, res } = createMockContext();
      req.body = { usuario: 'chefvitor', password: 'senha_errada' };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-id-1',
        usuario: 'chefvitor',
        password: 'hash_no_banco',
      });
      mockBcrypt.compare.mockResolvedValue(false);

      await loginUsuario(req, res);

      expect(mockBcrypt.compare).toHaveBeenCalledWith('senha_errada', 'hash_no_banco');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Senha inválida.' });
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it('deve autenticar com sucesso, emitir cookie HttpOnly e retornar status 200', async () => {
      const { req, res } = createMockContext();
      req.body = { usuario: 'chefvitor', password: 'senha_correta' };

      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-id-1',
        usuario: 'chefvitor',
        password: 'hash_no_banco',
      });
      mockBcrypt.compare.mockResolvedValue(true);
      mockJwt.sign.mockReturnValue('jwt_token_gerado');

      await loginUsuario(req, res);

      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId: 'user-id-1', usuario: 'chefvitor' },
        process.env.JWT_SECRET,
        { expiresIn: '300s' }
      );

      expect(res.cookie).toHaveBeenCalledWith('token', 'jwt_token_gerado', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 300000,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Login bem-sucedido!' });
    });
  });

  describe('verificarSessao', () => {
    it('deve retornar status 200 informando autenticado true e o identificador do usuário', () => {
      const { req, res } = createMockContext();
      req.userUsuario = 'chefvitor';

      verificarSessao(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        autenticado: true,
        usuario: 'chefvitor',
      });
    });
  });
});
