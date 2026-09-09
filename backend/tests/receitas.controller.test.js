import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockObterRespostaReceita = jest.fn();

jest.unstable_mockModule('../src/services/openai.services.js', () => ({
  default: mockObterRespostaReceita,
}));

const { perguntarReceita } = await import('../src/controllers/receitas.controller.js');

const createMockContext = () => {
  const req = {
    body: {},
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return { req, res };
};

describe('receitasController (src/controllers/receitas.controller.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('perguntarReceita', () => {
    it('deve retornar status 400 se a pergunta não for enviada no corpo da requisição', async () => {
      const { req, res } = createMockContext();
      req.body = {};

      await perguntarReceita(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        erro: 'É obrigatorio enviar uma pergunta',
      });
      expect(mockObterRespostaReceita).not.toHaveBeenCalled();
    });

    it('deve retornar status 200 com a resposta da OpenAI quando a pergunta for válida', async () => {
      const { req, res } = createMockContext();
      req.body = { pergunta: 'O que posso cozinhar com frango e batatas?' };

      const respostaMockIA = 'Receita de Frango Assado com Batatas:\n1. Tempere o frango...';
      mockObterRespostaReceita.mockResolvedValue(respostaMockIA);

      await perguntarReceita(req, res);

      expect(mockObterRespostaReceita).toHaveBeenCalledWith('O que posso cozinhar com frango e batatas?');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ resposta: respostaMockIA });
    });

    it('deve retornar status 500 se o serviço da OpenAI disparar uma exceção', async () => {
      const { req, res } = createMockContext();
      req.body = { pergunta: 'Receita rápida' };

      mockObterRespostaReceita.mockRejectedValue(new Error('Timeout de comunicação com API'));

      await perguntarReceita(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        erro: 'Erro ao processar sua pergunta',
      });
    });
  });
});
