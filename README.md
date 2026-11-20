# Carpas
Plataforma destinada ao cadastro, organizacao, administracao e acompanhamento dos formadores, permitindo gerir informacoes pessoais, qualificacoes, contratos, disciplinas, horarios, renumeracoes e desempenho

## Frontend

Frontend estático (HTML + Bootstrap 4), sem PHP.

```
Frontend/
├── index.html                     # entrada
├── pages/
│   ├── dasboard.html              # painel (header + sidebar + footer)
│   ├── formador/index.html
│   └── formandos/index.html
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
        ├── main.js
        ├── config/apiConfig.js
        └── services/api.js
```

### Como funcionam os partials (sem PHP)

Cada página declara a raiz relativa e os fragmentos a incluir:

```html
<body data-page="dashboard" data-root="../">
  <div data-include="{{root}}partials/header.html"></div>
  <div data-include="{{root}}partials/sidebar.html"></div>
  <!-- conteúdo -->
  <div data-include="{{root}}partials/footer.html"></div>
  <script src="../src/js/partials.js" defer></script>
</body>
```

- `data-root` é o caminho da página até `Frontend/`.
- `partials.js` substitui `{{root}}` no fragmento, pelo que os partials podem
  referenciar assets (`{{root}}public/img/logo.png`, `{{root}}pages/...`).
- O item do menu cujo `data-menu` é igual ao `data-page` do `<body>` fica ativo.
- É necessário servir por HTTP (XAMPP), pois `file://` bloqueia o `fetch`.

### Ver o dashboard

Com o XAMPP a correr:

```
http://localhost/CARPAS/Carpas/Frontend/pages/dasboard.html
```
