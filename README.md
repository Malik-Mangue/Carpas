# Carpas
Plataforma destinada ao cadastro, organizacao, administracao e acompanhamento dos formadores, permitindo gerir informacoes pessoais, qualificacoes, contratos, disciplinas, horarios, renumeracoes e desempenho

## Frontend

Frontend estático (HTML + Bootstrap 4 + jQuery), sem PHP.

```
Frontend/
├── index.html                     # entrada: carrega o dashboard no #app
├── pages/
│   ├── dasboard/
│   │   ├── dasboard.html          # conteúdo do painel
│   │   └── dasboard.js            # script da página
│   ├── formador/
│   │   ├── formador.html          # listagem + modais (novo/editar/remover/detalhes)
│   │   └── formador.js            # interações (lista vazia, à espera da API)
│   ├── formandos/
│   │   ├── formandos.html        # listagem + modais (novo/editar/remover)
│   │   └── formandos.js          # interações (lista vazia, à espera da API)
│   ├── turma/
│   │   ├── turma.html             # listagem + modais (novo/editar/remover/detalhes)
│   │   └── turma.js               # interações (listas vazias, à espera da API)
│   └── matricula/
│       ├── matricula.html         # listagem + modais (novo/editar/remover)
│       └── matricula.js           # interações (listas vazias, à espera da API)
├── partials/                      # fragmentos HTML reutilizáveis
│   ├── header.html                # topbar + sprite de ícones SVG
│   ├── sidebar.html               # menu lateral
│   └── footer.html
├── public/
│   ├── img/logo.png
│   └── libs/                      # bootstrap 4 + jquery (local)
└── src/
    ├── css/
    │   ├── style.css
    │   └── dashboard.css          # layout do painel
    └── js/
        ├── partials.js            # injeta os partials via fetch
        ├── main.js                # arranque + rotas por hash
        ├── utils/PageLoad.js      # carrega pages/<nome>/<nome>.html + .js
        ├── routes/routes.js
        ├── utils/validation.js
        ├── config/apiConfig.js
        └── services/api.js
```

### Página inicial

`index.html` é o shell da aplicação:

```html
<body data-page="dashboard" data-root="./">
  <div data-include="{{root}}partials/header.html"></div>
  <div data-include="{{root}}partials/sidebar.html"></div>

  <div id="app"></div>

  <div data-include="{{root}}partials/footer.html"></div>
  <script src="./src/js/partials.js" defer></script>
  <script type="module" src="./src/main.js"></script>
</body>
```

`src/main.js` pede a página inicial ao `PageLoad`:

```js
import carregarPagina from "./js/utils/PageLoad.js";
$(function () { carregarPagina('dasboard'); });
```

### Rotas

| Hash | Página |
|---|---|
| `#dashboard` (ou sem hash) | `pages/dasboard/dasboard.html` |
| `#formador` | `pages/formador/formador.html` |
| `#formandos` | `pages/formandos/formandos.html` |
| `#turma` | `pages/turma/turma.html` |
| `#matricula` | `pages/matricula/matricula.html` |

O `main.js` lê `location.hash`, chama o `PageLoad` e marca o item de menu
correspondente. Novas páginas: acrescentar a entrada em `ROTAS` e `MENU`.

### Como carregar outra página

Basta criar `pages/<nome>/<nome>.html` (e, opcionalmente, `<nome>.js`) e chamar:

```js
carregarPagina('turma');   // → pages/turma/turma.html + pages/turma/turma.js
```

- O HTML é injetado em `#app` com `jQuery.load()`.
- Se o `.html` não existir, o `#app` mostra um aviso.
- O `.js` da página é carregado depois do HTML (substitui o anterior, id `script-pagina`).

### Partials (sem PHP)

- `partials.js` faz `fetch` de cada `[data-include]` e substitui `{{root}}`.
- `data-root` é o caminho da página até `Frontend/`.
- O item do menu cujo `data-menu` é igual ao `data-page` do `<body>` fica ativo.
- É necessário servir por HTTP (XAMPP), pois `file://` bloqueia o `fetch`.

### Ver no browser

Com o XAMPP a correr:

```
http://localhost/CARPAS/Carpas/Frontend/index.html
```

## Convenções de código

### JavaScript

- **Nunca usar `var`**: usar `const` por omissão e `let` apenas quando o valor é reatribuído.
- Nomes descritivos, em português: `listaFormadores`, `renderizarTabela`, `encontrarFormador`
  (evitar `f`, `x`, `el`, `arr`).
- Indentação de 4 espaços, aspas duplas, ponto e vírgula.
- Escapar sempre conteúdo dinâmico com `escaparHtml()` antes de entrar em `innerHTML`.
- Um ficheiro de página = `pages/<nome>/<nome>.html` + `pages/<nome>/<nome>.js` (IIFE, sem globais).

### CSS

- Variáveis em `:root` para cores e medidas repetidas.
- Classes em `kebab-case`, nomes ligados ao domínio (`stat-card`, `table-formadores`).
