import obterRespostaReceita from "../services/gemini.services.js";

export const perguntarReceita = async (req, res) => {
  try {
    const { pergunta } = req.body;

    if (!pergunta) {
      return res.status(400).json({
        erro: "É obrigatorio enviar uma pergunta",
      });
    }

    const resposta = await obterRespostaReceita(pergunta);

    return res.status(200).json({ resposta });
  } catch (error) {
    console.error("Erro no controlador de receitas ao processar pergunta:", {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ erro: "Erro ao processar sua pergunta" });
  }
};
