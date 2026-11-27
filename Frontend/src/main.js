import carregarPagina from "./js/utils/PageLoad.js";

// Rotas da aplicação: hash → página em pages/<nome>/<nome>.html
const ROTAS = {
    "": "dasboard",
    "#dashboard": "dasboard",
    "#formador": "formador",
    "#formandos": "formandos",
    "#turma": "turma",
    "#matricula": "matricula"
};

// Página → item do menu que fica ativo
const MENU_POR_PAGINA = {
    dasboard: "dashboard",
    formador: "formador",
    formandos: "formando",
    turma: "turma",
    matricula: "matricula"
};

function obterPaginaAtual() {
    return ROTAS[window.location.hash] || "dasboard";
}

function marcarMenuAtivo() {
    const paginaAtual = obterPaginaAtual();
    const menuAtivo = MENU_POR_PAGINA[paginaAtual] || paginaAtual;

    $(".sidebar-menu a[data-menu]").each(function () {
        const $linkMenu = $(this);
        const estaAtivo = $linkMenu.attr("data-menu") === menuAtivo;

        $linkMenu.toggleClass("active", estaAtivo);

        if (estaAtivo) {
            $linkMenu.attr("aria-current", "page");
        } else {
            $linkMenu.removeAttr("aria-current");
        }
    });
}

function navegar() {
    carregarPagina(obterPaginaAtual());
    marcarMenuAtivo();
}

$(function () {
    navegar();
    $(window).on("hashchange", navegar);

    // Os partials são injetados depois; re-aplicar o menu ativo nessa altura.
    $(document).on("partials:ready", marcarMenuAtivo);
});
