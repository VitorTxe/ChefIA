# 👨‍🍳 ChefIA

Seu assistente pessoal de receitas com IA! O ChefIA ajuda você a descobrir o que cozinhar com base nos ingredientes que você já tem na sua geladeira. 

## 🚀 Sobre o Projeto

O **ChefIA** é uma aplicação Fullstack moderna construída em formato Monorepo (dividindo frontend e backend no mesmo repositório). O objetivo do app é interagir com o usuário via chat e usar Inteligência Artificial para gerar receitas práticas, personalizadas e deliciosas de forma rápida a partir dos ingredientes disponíveis.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** + **Vite** para construção rápida e moderna da interface.
- **Tailwind CSS 4** para estilização flexível, responsiva e moderna.
- **React Router** para navegação entre páginas (Login, Chat, etc).
- **Axios** para consumo da API.

### Backend
- **Node.js** com **Express** para criação da API REST.
- **OpenAI API** para o "cérebro" do assistente de receitas.
- **Prisma ORM** + **MongoDB** para o banco de dados.
- **Segurança e Autenticação:** `jsonwebtoken` (JWT) e `bcrypt` para login/cadastro seguro, `helmet` (proteção de headers HTTP), `cors` (controle de acesso) e `express-rate-limit` (prevenção contra ataques de força bruta/DDoS).

## 📂 Estrutura do Projeto

Este projeto utiliza **NPM Workspaces** para gerenciar o monorepo:

```text
devchef2/
├── backend/            # Lógica da API, rotas, banco de dados (Prisma) e conexão com OpenAI
├── frontend/           # Interface do usuário (Páginas e Componentes em React)
├── package.json        # Arquivo raiz do monorepo
└── README.md
```

## ⚙️ Como Executar Localmente

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado na sua máquina.

### 2. Instalação das dependências
Abra o terminal na pasta raiz do projeto (`devchef2`) e rode:
```bash
npm install
```
*Este comando vai instalar as dependências de todas as pastas (`frontend` e `backend`) de uma vez só graças aos workspaces.*

### 3. Variáveis de Ambiente
Crie um arquivo `.env` dentro da pasta `backend/` e adicione as suas chaves:
```env
PORT=3001
DATABASE_URL="sua_url_de_conexao_com_o_banco"
JWT_SECRET="sua_chave_secreta_super_segura"
OPENAI_API_KEY="sua_chave_da_openai"
FRONTEND_URL="http://localhost:5173"
```

Crie um arquivo `.env` dentro da pasta `frontend/`:
```env
VITE_API_URL="http://localhost:3001/api"
```

### 4. Gerar o cliente Prisma (Banco de Dados)
Ainda no terminal, caso precise gerar os arquivos do Prisma para o backend:
```bash
cd backend
npx prisma generate
cd ..
```

### 5. Executando o Projeto
Para iniciar simultaneamente o Frontend e o Backend localmente, volte para a raiz do projeto e rode:
```bash
npm run dev
```

* O **Frontend** estará rodando em: `http://localhost:5173`
* O **Backend** estará rodando em: `http://localhost:3001`

---
*Desenvolvido com dedicação para tornar a rotina na cozinha mais fácil!* 🍲
