# Relatório — Práticas 5 e 6

## Objetivo

Desenvolver a interface de um sistema de cadastro de produtos com React, aplicando componentes, estados, formulários, validações, experiência do usuário, responsividade e organização de código.

## Prática 5 — Construção inicial

A aplicação foi organizada em componentes funcionais. O componente principal controla o estado do catálogo e os componentes de formulário, painel e listagem apresentam partes específicas da interface. O formulário permite informar nome, categoria, preço, quantidade e descrição. Após o cadastro, o produto aparece imediatamente no catálogo, sem recarregar a página.

Foram aplicados princípios de UX como hierarquia visual, rótulos claros, feedback após ações, estado vazio, busca e confirmação de operações destrutivas.

## Prática 6 — Aprimoramentos

Foram implementadas validações para impedir nomes vazios ou muito curtos, categoria não selecionada, preço inválido, quantidade negativa ou decimal e descrições acima do limite. Cada problema é exibido junto ao campo correspondente.

A interface se adapta a computadores, tablets e celulares com media queries. Também foram incluídos filtro, ordenação, indicadores de estoque e persistência em banco SQLite. A camada `productService` separa o acesso aos dados e consome uma API REST desenvolvida em Node.js.

## Versionamento sugerido

O projeto inclui `.gitignore` para evitar o versionamento de dependências e arquivos gerados. Uma sequência de commits coerente seria:

1. `chore: configura projeto React com Vite`
2. `feat: implementa cadastro e listagem de produtos`
3. `feat: adiciona validações e persistência local`
4. `style: melhora responsividade e experiência do usuário`
5. `docs: adiciona documentação do projeto`

## Possível evolução Full Stack

A evolução Full Stack foi implementada: as funções de `productService.js` usam `fetch` para consumir os endpoints `GET /api/products`, `POST /api/products`, `PUT /api/products/:id` e `DELETE /api/products/:id`. A API valida os dados novamente no servidor e usa SQLite para garantir persistência entre execuções.

## Conclusão

O resultado atende ao cadastro e à visualização de produtos e acrescenta recursos esperados em um sistema real: validação no cliente e no servidor, edição, exclusão segura, pesquisa, filtros, banco de dados, API, acessibilidade e responsividade.
