import { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import { verificarSessao } from '../services/api';

const ProtectedRoute = ({ children }) => {
  // null = ainda verificando | true = autenticado | false = não autenticado
  const [autenticado, setAutenticado] = useState(null);

  useEffect(() => {
    // Pergunta ao backend se o cookie ainda é válido
    verificarSessao()
      .then(() => setAutenticado(true))
      .catch(() => setAutenticado(false));
  }, []);

  //TODO colocar um spinner aqui (carregando...)
  // Enquanto espera a resposta do backend, não faz nada
  if (autenticado === null) {
    return null;
  }

  // Se não estiver autenticado, manda para o login
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza a página normalmente
  return children;
};

export default ProtectedRoute;