import { useState } from "react";
import { useNavigate } from "react-router";
import { cadastrarUsuario } from "../services/api";

const CreateAccount = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('As senhas não coincidem!');
            return;
        }

        try {
            // A API espera um objeto com 'usuario' e 'password'
            const dadosUsuario = { usuario: username, password: password };
            await Promise.all([await cadastrarUsuario(dadosUsuario), new Promise(resolve => setTimeout(resolve, 800))])
            
            setSuccess('Conta criada com sucesso! Redirecionando para o login...');
            setTimeout(() => {
                // Redireciona para a página de login após 3 segundos
                navigate('/login'); 
            }, 3000);
        } catch (err) {
            setError('Erro ao criar conta.');
            console.error(err);
        }
    };

    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="p-10 space-y-6 bg-white rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold text-center text-gray-800">Crie sua Conta</h2>
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="username">
                    Usuário
                </label>
                <input 
                    id="username"
                    className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00ff] focus:border-transparent" 
                    type="text" 
                    placeholder="Escolha um nome de usuário"
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
                    className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00ff] focus:border-transparent" 
                    type="password" 
                    placeholder="Crie uma senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="confirm-password">
                    Confirmar Senha
                </label>
                <input 
                    id="confirm-password"
                    className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B00ff] focus:border-transparent" 
                    type="password" 
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-[#FF6B00ff] rounded-md hover:bg-orange-600 transition-colors duration-300 cursor-pointer">Criar Conta</button>
            {error && <p className="text-sm text-center text-red-500">{error}</p>}
            {success && <p className="text-sm text-center text-green-500">{success}</p>}
            <p className="text-sm text-center text-gray-600">
                Já tem uma conta?{' '}
                <button type="button" onClick={() => navigate('/login')} className="font-medium text-blue-500 hover:underline cursor-pointer">Faça Login</button>
            </p>
        </form>
    </div>    
    )
}

export default CreateAccount;