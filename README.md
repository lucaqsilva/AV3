# Meu Armário — Gestão de produtos

Projeto acadêmico das Práticas 5 e 6: uma aplicação Full Stack em React e Node.js para cadastrar e gerenciar produtos com persistência em banco SQLite.

## Funcionalidades

- Cadastro, edição e exclusão de produtos (CRUD)
- Validação de todos os campos obrigatórios e mensagens de erro
- Busca por nome ou descrição, filtro por categoria e ordenação
- Resumo com quantidade de produtos, valor total e alerta de estoque baixo
- Persistência real em banco de dados SQLite
- Confirmação antes da exclusão e notificações de sucesso
- Layout responsivo, semântico e acessível
- API REST em Node.js com validações também no servidor

## Tecnologias

- Node.js e npm
- React
- Vite
- Node.js (`node:http` e `node:sqlite`)
- SQLite
- JavaScript (ES Modules)
- CSS responsivo
- Git

## Como executar

É necessário ter o Node.js 20 ou mais recente instalado.

```bash
npm install
npm run dev
```

Abra o endereço indicado pelo Vite, normalmente `http://localhost:5173`.

O comando inicia dois serviços: a interface React na porta `5173` e a API Node.js na porta `3001`. O Vite encaminha automaticamente as requisições `/api` para o servidor.

No PowerShell, se a política de execução bloquear o arquivo `npm.ps1`, use os comandos equivalentes `npm.cmd install` e `npm.cmd run dev`.

## Verificação de qualidade

```bash
npm run lint
npm run build
```

## Organização

```text
src/
├── components/  # Componentes visuais reutilizáveis
├── data/        # Dados fixos da aplicação
├── services/    # Comunicação da interface com a API
├── styles/      # Estilos globais e responsivos
├── utils/       # Funções de formatação
├── App.jsx      # Estado e regras da tela principal
└── main.jsx     # Inicialização do React

server/
├── database.js  # Tabela e operações do SQLite
└── server.js    # API REST e servidor de produção
```

Os dados ficam salvos em `.data/products.db`. A pasta é criada automaticamente e está no `.gitignore`, evitando publicar informações cadastradas. O arquivo `productService.js` usa `fetch` para consumir os endpoints `GET`, `POST`, `PUT` e `DELETE` da API.

Depois do build, `npm start` executa o servidor Node na porta `3001`, servindo tanto a API quanto os arquivos compilados da interface.
