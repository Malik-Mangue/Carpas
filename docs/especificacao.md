# Especificação do Sistema — Carpas

## 1. Visão Geral e Objetivo
O **Carpas** é uma plataforma web para cadastro, organização, administração e acompanhamento de formadores. O sistema centraliza a gestão de:

- **Dados pessoais e contactos** dos formadores;
- **Qualificações e especialidades** técnicas e pedagógicas;
- **Contratos e remunerações**;
- **Disciplinas, turmas e horários** atribuídos;
- **Desempenho e acompanhamento** contínuo.

## 2. Tecnologias Permitidas (Frontend)
A aplicação frontend deve ser construída exclusivamente com tecnologias simples e diretas:

- **HTML5**: estrutura das páginas e componentes;
- **CSS3**: estilização complementar quando necessário;
- **Bootstrap 4** (ficheiros locais em `Frontend/public/libs/css` e `Frontend/public/libs/js`): layout responsivo, grelha, tabelas, formulários e modais;
- **jQuery**: manipulação do DOM, tratamento de eventos e chamadas AJAX para CRUD.

### Restrições da Fase Inicial
- **Sem injeção de dependências (DI)**: não utilizar containers de DI, carregadores de módulos complexos nem frameworks SPA (React, Angular, Vue, etc.).
- **Sem build tools obrigatórios**: o código deve correr diretamente no navegador com HTML, CSS, jQuery e Bootstrap.
- **Simplicidade**: cada página tem o seu próprio ficheiro `.html` e `.js` com lógica direta e fácil de ler.

## 3. Estrutura de Pastas
```text
Carpas/
├── docs/
│   └── especificacao.md          # Especificação completa do sistema
└── Frontend/
    ├── pages/
    │   └── formadores/
    │       ├── formadores.html   # Página de gestão de formadores
    │       └── formadores.js     # Lógica jQuery da página de formadores
    └── public/
        └── libs/
            ├── css/              # Ficheiros CSS do Bootstrap 4
            └── js/               # Ficheiros JS do Bootstrap 4
```

## 4. Módulos Funcionais do Sistema

### 4.1. Formadores (Módulo Principal)
- Listagem de formadores com pesquisa rápida por nome, email ou especialidade.
- Criação, edição e remoção de formadores (dados base: nome, email, telefone, especialidade, estado).
- Validação em tempo real ao digitar (evento `input`) com feedback visual verde/vermelho.
- Estado do formador (`Ativo` / `Inativo`).

### 4.2. Qualificações e Disciplinas *(planeado)*
- Registo de certificações, habilitações académicas e áreas de competência.
- Associação de formadores às disciplinas que podem lecionar.

### 4.3. Contratos e Remunerações *(planeado)*
- Registo de tipo de contrato, vigência, valor/hora ou remuneração base.
- Histórico contratual por formador.

### 4.4. Horários e Turmas *(planeado)*
- Alocação de formadores a turmas e blocos horários.
- Controlo de disponibilidade e conflitos de agenda.

### 4.5. Desempenho e Acompanhamento *(planeado)*
- Registo de avaliações, assiduidade e observações pedagógicas.
- Relatórios simples de atividade por formador.

## 5. Boas Práticas de Desenvolvimento
- **Declaração de variáveis**: usar sempre `const` (para referências/valores constantes) e `let` (para variáveis que mudam de valor). **Evitar o uso de `var`**.
- **Páginas autocontidas**: manter cada módulo em `Frontend/pages/<modulo>/` com `<modulo>.html` e `<modulo>.js`.
- **Bibliotecas locais**: usar os ficheiros locais de Bootstrap em `Frontend/public/libs/`.
- **Validações no DOM**: validar campos no evento `input`, aplicando `.is-valid` (verde) quando correto e `.is-invalid` + `.invalid-feedback` (vermelho) com a mensagem de erro quando inválido.
- **Integração com API**: preparar os scripts para receber JSON (convertendo para array de objetos quando necessário) e executar operações CRUD via `$.ajax`, mantendo o código simples e legível.

## 6. Layout e Identidade Visual da Dashboard Administrativa

O layout oficial da dashboard administrativa está estruturado nos ficheiros:
- `dashboard/index.html` (e espelho em `docs/dashboard/index.html`)
- `dashboard/styles.css` (e espelho em `docs/dashboard/styles.css`)
- `dashboard/assets/icons/*.svg` (ícones individuais em formato SVG 24x24 com traço de 1.8px)

### 6.1. Paleta de Cores e Tokens
- **Fundo Principal**: `#F0E7D6` (Bege Claro / Off-White)
- **Superfície (Cartões)**: `#FFFFFF`
- **Fundo da Sidebar**: `#1B1B1B` (Ink Black)
- **Cor Primária**: `#EA2E00` (Vermelho/Laranja Carpas)
- **Cor de Destaque**: `#EA2E00`
- **Texto Principal**: `#1B1B1B` (Ink Black)
- **Texto Secundário**: `#5A7370` (Sage escurecido para legibilidade)
- **Perigo (Sign Out)**: `#DC2626`

### 6.2. Estrutura da Barra Lateral (Sidebar)
- Largura fixa (~260px) com nome do projeto no topo.
- Item "Dashboard" destacado no topo com barra indicadora lateral na cor primária.
- Duas secções em blocos translúcidos com efeito de vidro (`backdrop-filter: blur(8px)`, bordas subtis e fundo `rgba(255, 255, 255, 0.04)`):
  1. **Estrutura Curricular**: Módulo, Qualificação, Nível, Campo, Sala.
  2. **Administração**: Usuário, Logs, Perfis.
- Menu de perfil flutuante na base da barra lateral com opções "Alterar perfil" e "Sign out" (em cor de perigo), com controlo de acessibilidade (`aria-haspopup` e `aria-expanded`) e fecho ao clicar fora ou pressionar `Escape`.

### 6.3. Área Principal e Responsividade
- Cabeçalho informativo, 4 cartões de estatísticas principais e painel de visão geral curricular.
- Adaptação responsiva para ecrãs menores (`max-width: 768px`) e suporte nativo a `prefers-reduced-motion`.
