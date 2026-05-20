import sopa3 from '../assets/sopa3.png';
import add_coment from '../assets/add_coment.png';
import logout from '../assets/logout.png';


const SideBar = ({ conversas, conversaAtualId, onNovaConversa, onSelecionarConversa, onDeletarConversa, onLogout, isOpen, onClose }) => {
    return (
        <aside className={`fixed z-50 md:static flex h-full w-64 flex-col bg-white border-r border-[#e9ecef] transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
            <div className='flex justify-between items-center p-3 mb-5'>
                <div className='flex gap-3'>
                    <div className='flex items-center justify-center'>
                        <img src={sopa3} className=' w-12 h-10 p-1 text-black bg-[#FF6B00ff] rounded-full'/>
                    </div>                   
                    <div className='flex flex-col'>
                        <h2 className="text-lg font-bold font-mono leading-normal" >ChefIA</h2>
                        <p className=' text-[#a6a4a3e7] font-mono text-sm'>Assistente de receitas</p>
                    </div>              
                </div>
                <button 
                    onClick={onClose}
                    className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <nav >
                <div className='px-3 mb-4'>
                        <button onClick={onNovaConversa} className="group w-full flex items-center gap-3 p-2 rounded hover:bg-[#FFF0E5ff] hover:text-[#FF6B00ff] text-left">
                            <img src={add_coment} className='w-7 h-7 group-hover:filter-[invert(58%)_sepia(99%)_saturate(1351%)_hue-rotate(359deg)_brightness(99%)_contrast(105%)]'/>
                            Nova Conversa
                        </button>
                </div>

                {/* Histórico de Conversas */}
                <div className="flex-1 overflow-y-auto px-3">
                    <h3 className="px-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Histórico</h3>
                    <ul className='flex flex-col gap-1'>
                        {conversas.map((conversa) => (
                            <li key={conversa.id} className="flex items-center group">
                                <button
                                    onClick={() => onSelecionarConversa(conversa.id)} 
                                    className={`flex-1 text-left p-2 rounded-l truncate text-sm ${
                                        conversa.id === conversaAtualId 
                                        ? 'bg-[#FFF0E5ff] text-[#FF6B00ff] font-semibold' 
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {conversa.titulo}
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Impede que onSelecionarConversa seja chamado
                                        onDeletarConversa(conversa.id);
                                    }}
                                    className={`p-2 rounded-r text-gray-500 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-opacity ${
                                        conversa.id === conversaAtualId ? 'bg-[#FFF0E5ff]' : 'hover:bg-gray-100'
                                    }`}
                                >
                                    &#x1F5D1; {/* Ícone de lixeira */}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            <div className='mt-auto p-3 border-t border-[#e9ecef]'>
                <button 
                    onClick={onLogout} 
                    className='group flex items-center gap-3 w-full p-2 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 cursor-pointer'
                >
                    <img src={logout} alt="" className='w-5 h-5 opacity-70 group-hover:opacity-100' />
                    <span className="font-medium">Sair</span>
                </button>
            </div>
        </aside>
    );
}

export default SideBar;
