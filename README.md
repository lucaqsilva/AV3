# Stockly — Gestão de produtos

Projeto acadêmico das Práticas 5 e 6: uma aplicação front-end em React para cadastrar e gerenciar produtos.

## Funcionalidades

- Cadastro, edição e exclusão de produtos (CRUD)
- Validação de todos os campos obrigatórios e mensagens de erro
- Busca por nome ou descrição, filtro por categoria e ordenação
- Resumo com quantidade de produtos, valor total e alerta de estoque baixo
- Persistência no `localStorage` do navegador
- Confirmação antes da exclusão e notificações de sucesso
- Layout responsivo, semântico e acessível
- Serviço de dados isolado e preparado para futura substituição por API REST

## Tecnologias

- Node.js e npm
- React
- Vite
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
├── services/    # Persistência e futura integração com API
├── styles/      # Estilos globais e responsivos
├── utils/       # Funções de formatação
├── App.jsx      # Estado e regras da tela principal
└── main.jsx     # Inicialização do React
```

Os dados ficam salvos sob a chave `stockly-products-v1` no `localStorage`. O arquivo `productService.js` centraliza as operações e pode ser adaptado para usar `fetch` com uma API Node/Express no futuro.
