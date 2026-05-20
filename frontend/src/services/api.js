import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Cria uma instância do Axios. Usaremos esta instância para todas as chamadas.
const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  // Necessário para o browser enviar o cookie HttpOnly automaticamente em cada requisição
  withCredentials: true,
});

// Interceptor de Resposta: Lida com erros 401 (token expirado/inválido).
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Sessão expirada ou inválida. Redirecionando para o login.");
      // Não precisamos mais limpar o localStorage, o cookie é gerenciado pelo browser
      window.location.href = "/login";
    } else if (error.response && error.response.status === 429) {
      console.error("Muitas requisições. Limite de taxa atingido.");
      alert("Você atingiu o limite de requisições. Por favor, tente novamente em alguns minutos.");
    }
    return Promise.reject(error);
  }
);


export const perguntarReceita = async (pergunta) => {
  try {
    const response = await apiClient.post("/receitas/perguntar", { pergunta });
    return response.data.resposta;

  } catch (error) {
    console.error("Erro ao buscar resposta no servidor", error);
    throw error;
  }
};

export const cadastrarUsuario = async (dadosUsuario) => {
  try {
    const response = await apiClient.post("/auth/cadastrar", dadosUsuario);
    return response.data;

  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error.response?.data || error.message);
    throw error;
  }
};

export const loginUsuario = async (dadosLogin) => {
  const response = await apiClient.post("/auth/login", dadosLogin);
  return response.data;
};

// Chama o backend para verificar se o cookie de sessão ainda é válido
export const verificarSessao = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
};
