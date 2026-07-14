# Relatório — Práticas 5 e 6

## Objetivo

Desenvolver a interface de um sistema de cadastro de produtos com React, aplicando componentes, estados, formulários, validações, experiência do usuário, responsividade e organização de código.

## Prática 5 — Construção inicial

A aplicação foi organizada em componentes funcionais. O componente principal controla o estado do catálogo e os componentes de formulário, painel e listagem apresentam partes específicas da interface. O formulário permite informar nome, categoria, preço, quantidade e descrição. Após o cadastro, o produto aparece imediatamente no catálogo, sem recarregar a página.

Foram aplicados princípios de UX como hierarquia visual, rótulos claros, feedback após ações, estado vazio, busca e confirmação de operações destrutivas.

## Prática 6 — Aprimoramentos

Foram implementadas validações para impedir nomes vazios ou muito curtos, categoria não selecionada, preço inválido, quantidade negativa ou decimal e descrições acima do limite. Cada problema é exibido junto ao campo correspondente.

A interface se adapta a computadores, tablets e celulares com media queries. Também foram incluídos filtro, ordenação, indicadores de estoque e persistência no navegador. A camada `productService` separa o acesso aos dados da interface e facilita uma futura integração com API REST.

## Versionamento sugerido

O projeto inclui `.gitignore` para evitar o versionamento de dependências e arquivos gerados. Uma sequência de commits coerente seria:

1. `chore: configura projeto React com Vite`
2. `feat: implementa cadastro e listagem de produtos`
3. `feat: adiciona validações e persistência local`
4. `style: melhora responsividade e experiência do usuário`
5. `docs: adiciona documentação do projeto`

## Possível evolução Full Stack

Em uma etapa futura, as funções de `productService.js` podem usar `fetch` para consumir endpoints de uma API Node.js, por exemplo `GET /products`, `POST /products`, `PUT /products/:id` e `DELETE /products/:id`. A separação atual permite essa troca sem reescrever os componentes de apresentação.

## Conclusão

O resultado atende ao cadastro e à visualização de produtos e acrescenta recursos esperados em um sistema real: validação, edição, exclusão segura, pesquisa, filtros, persistência, acessibilidade e responsividade.
