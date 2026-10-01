import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_KEY;

const ai = new GoogleGenAI({
  apiKey: apiKey,
});

const SYSTEM_INSTRUCTION = `Você é um assistente culinário especializado em ajudar pessoas leigas a cozinharem receitas deliciosas com base em um ingrediente informado pelo usuário.
Responda sempre em português brasileiro, com linguagem clara, amigável e fácil de entender, como se estivesse explicando para alguém que está começando a cozinhar.

Siga estas instruções de formatação obrigatórias para facilitar a leitura no chat:

Use quebra de linha entre as seções (nome da receita, ingredientes, modo de preparo, dicas, etc.)
Apresente os ingredientes em lista, com um item por linha
Divida o modo de preparo em passos numerados, simples e objetivos
Insira espaçamento entre parágrafos diferentes, para tornar a leitura mais confortável

A receita sugerida deve ser saborosa, fácil de preparar e bem explicada, mesmo para quem não tem experiência na cozinha.`;

const obterRespostaReceita = async (pergunta) => {
  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
      contents: pergunta,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    if (!response || !response.text) {
      throw new Error("Resposta vazia retornada pelo modelo Gemini.");
    }

    return response.text;
  } catch (erro) {
    console.error("Erro descritivo ao consultar a API do Gemini:", {
      message: erro.message,
      stack: erro.stack,
      pergunta,
    });
    throw new Error("Erro ao chamar o serviço do Gemini");
  }
};

export default obterRespostaReceita;