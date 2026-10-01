import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockGenerateContent = jest.fn();

jest.unstable_mockModule('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

const { default: obterRespostaReceita } = await import('../src/services/gemini.services.js');

describe('geminiService (src/services/gemini.services.js)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o texto da receita gerado pelo Gemini com sucesso', async () => {
    const textoMock = 'Bolo de Cenoura:\n- Cenouras\n- Ovos\n1. Misture tudo.';
    mockGenerateContent.mockResolvedValue({
      text: textoMock,
    });

    const resultado = await obterRespostaReceita('Como fazer bolo de cenoura?');

    expect(resultado).toBe(textoMock);
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        contents: 'Como fazer bolo de cenoura?',
        model: expect.any(String),
        config: expect.objectContaining({
          systemInstruction: expect.any(String),
        }),
      })
    );
  });

  it('deve lançar erro descritivo quando a resposta do Gemini vier vazia', async () => {
    mockGenerateContent.mockResolvedValue({
      text: null,
    });

    await expect(obterRespostaReceita('Pergunta')).rejects.toThrow('Erro ao chamar o serviço do Gemini');
  });

  it('deve logar e relançar erro caso a chamada de API falhe', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Erro de conexão com o Google'));

    await expect(obterRespostaReceita('Pergunta')).rejects.toThrow('Erro ao chamar o serviço do Gemini');
  });
});
