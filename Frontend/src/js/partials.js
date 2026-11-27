/**
 * partials.js — carregamento de partials HTML (header, sidebar, footer) sem PHP.
 *
 * Uso numa página:
 *   <body data-page="dashboard" data-root="./">
 *     <div data-include="{{root}}partials/header.html"></div>
 *     <div data-include="{{root}}partials/sidebar.html"></div>
 *     ...
 *     <div data-include="{{root}}partials/footer.html"></div>
 *   </body>
 *
 * - `data-root` é o caminho relativo da página até à raiz do Frontend.
 * - Os partials podem usar `{{root}}` nos seus próprios assets/links.
 * - O item de menu com data-menu igual a data-page fica marcado como ativo.
 *
 * Requer um servidor HTTP (XAMPP/LiteSpeed, Live Server, etc.):
 * com file:// o Ajax é bloqueado pelo browser.
 */
(function () {
    "use strict";

    const $corpoDocumento = $(document.body);
    const raizAplicacao = $corpoDocumento.data("root") || "./";
    const paginaAtual = $corpoDocumento.data("page") || "";

    function resolverCaminhos(html) {
        return html.split("{{root}}").join(raizAplicacao);
    }

    function injetarParcial($elementoInclusao) {
        const urlParcial = resolverCaminhos($elementoInclusao.attr("data-include"));

        return $.ajax({ url: urlParcial, dataType: "html" })
            .then(function (htmlParcial) {
                $elementoInclusao.replaceWith(resolverCaminhos(htmlParcial));
            })
            .catch(function (erro) {
                console.error("[partials] Falha ao carregar", urlParcial, erro);
                $elementoInclusao.html(
                    '<div class="alert alert-danger m-3" role="alert">' +
                    "Não foi possível carregar <code>" + urlParcial + "</code>. " +
                    "Abra a página através do servidor HTTP (ex.: XAMPP)." +
                    "</div>"
                );
            });
    }

    function carregarTodosOsParciais() {
        // Sequencial para preservar a ordem do DOM (header → sidebar → footer).
        return $("[data-include]").toArray().reduce(function (cadeia, elementoInclusao) {
            return cadeia.then(function () {
                return injetarParcial($(elementoInclusao));
            });
        }, $.when());
    }

    function marcarMenuAtivo() {
        if (!paginaAtual) return;

        $(".sidebar-menu a[data-menu]").each(function () {
            const $linkMenu = $(this);

            if ($linkMenu.data("menu") === paginaAtual) {
                $linkMenu.addClass("active").attr("aria-current", "page");
            }
        });
    }

    function inicializarBarraLateral() {
        const $barraLateral = $("#sidebar");
        const $botaoMenu = $("#sidebarToggle");
        const $fundoMenu = $("#sidebarBackdrop");

        if (!$barraLateral.length) return;

        function fecharMenu() {
            $barraLateral.removeClass("show");
            $fundoMenu.removeClass("show");
            $botaoMenu.attr("aria-expanded", "false");
        }

        function abrirMenu() {
            $barraLateral.addClass("show");
            $fundoMenu.addClass("show");
            $botaoMenu.attr("aria-expanded", "true");
        }

        $botaoMenu.on("click", function () {
            if ($barraLateral.hasClass("show")) {
                fecharMenu();
            } else {
                abrirMenu();
            }
        });

        $fundoMenu.on("click", fecharMenu);

        $(document).on("keydown", function (eventoTeclado) {
            if (eventoTeclado.key === "Escape") fecharMenu();
        });

        // Ao passar para desktop, garante que o estado móvel é limpo.
        $(window).on("resize", function () {
            if (window.innerWidth >= 992) fecharMenu();
        });
    }

    function inicializarRodape() {
        $("#footerYear").text(new Date().getFullYear());
    }

    $(function () {
        carregarTodosOsParciais().then(function () {
            marcarMenuAtivo();
            inicializarBarraLateral();
            inicializarRodape();
            $(document).trigger("partials:ready");
        });
    });
})();
