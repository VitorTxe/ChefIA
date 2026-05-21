import { useState } from "react";
import { useNavigate } from "react-router";
import { loginUsuario } from "../services/api";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const changeLoadingColor = loading ? "bg-gray-400 hover:bg-none" : "bg-[#FF6B00ff] cursor-pointer hover:bg-orange-600"

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const dadosLogin = { usuario: username, password: password };

            // O Promise.all permite aguardar a requisição e um tempo mínimo de animação (800ms) simultaneamente
            const [response] = await Promise.all([
                loginUsuario(dadosLogin),
                new Promise((resolve) => setTimeout(resolve, 800))
            ]);

            // Pega apenas a mensagem de sucesso (o cookie já foi salvo pelo navegador nos bastidores)
            const { message } = response;

            setSuccess(message || "Login bem-sucedido!");

            // Aguarda 1.5 segundos para o usuário conseguir ler a mensagem antes de mudar de tela
            setTimeout(() => {
                navigate('/chat-receitas');
            }, 1500);

        } catch (err) {
            // Exibe a mensagem de erro vinda da API ("Usuário ou senha inválidos.")
            setError(err.response?.data?.error || "Falha no login. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="p-10 space-y-6 bg-white rounded-lg shadow-xl w-96">
                <h2 className="text-2xl font-bold text-center text-gray-800">Bem-vindo!</h2>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="username">
                        Usuário
                    </label>
                    <input
                        id="username"
                        disabled={loading}
                        className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00ff] focus:border-transparent disabled:opacity-50 disabled:bg-gray-200"
                        type="text"
                        placeholder="Seu usuário"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="password">
                        Senha
                    </label>
                    <input
                        id="password"
                        disabled={loading}
                        className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00ff] focus:border-transparent disabled:opacity-50 disabled:bg-gray-200"
                        type="password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-4 py-2 font-semibold text-white rounded-md transition-colors duration-300 ${changeLoadingColor}`}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
                {error && <p className="text-sm text-center text-red-500">{error}</p>}
                {success && <p className="text-sm text-center text-green-500">{success}</p>}
                <p className="text-sm text-center text-gray-600">
                    Não tem uma conta?{' '}
                    <button type="button" onClick={() => navigate('/criar-conta')} className="font-medium text-blue-500 hover:underline">Crie uma</button>
                </p>
            </form>
        </div>
    )
}

export default Login