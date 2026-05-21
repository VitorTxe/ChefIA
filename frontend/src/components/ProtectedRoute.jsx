import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { verificarSessao } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checarAutenticacao = async () => {
      try {
        // Tenta bater na rota /auth/me
        // O Axios enviará o cookie automaticamente. Se o cookie for válido, retorna sucesso.
        await verificarSessao();
        setIsAuthenticated(true);

      } catch (error) {
        // Se der erro (ex: 401 Unauthorized), a sessão é inválida
        setIsAuthenticated(false);
        console.error("Sessão inválida ou expirada:", error);
      }
    };

    checarAutenticacao();
  }, []);

  // Enquanto está checando a API, mostramos uma tela de carregamento (ou nada)
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500 font-medium">Verificando sessão...</p>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza o componente filho (ex: ChatReceitas)
  return children;
};

export default ProtectedRoute;