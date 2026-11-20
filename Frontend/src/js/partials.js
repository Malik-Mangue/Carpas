/**
 * partials.js — carregamento de partials HTML (header, sidebar, footer) sem PHP.
 *
 * Uso numa página:
 *   <body data-page="dashboard" data-root="../../">
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
 * com file:// o fetch é bloqueado pelo browser.
 */
(function () {
    'use strict';

    var body = document.body;
    var root = body.getAttribute('data-root') || './';
    var page = body.getAttribute('data-page') || '';

    function resolve(html) {
        return html.split('{{root}}').join(root);
    }

    function inject(el) {
        var url = resolve(el.getAttribute('data-include'));

        return fetch(url, { credentials: 'same-origin' })
            .then(function (res) {
                if (!res.ok) {
                    throw new Error(res.status + ' ' + res.statusText + ' — ' + url);
                }
                return res.text();
            })
            .then(function (html) {
                var wrapper = document.createElement('div');
                wrapper.innerHTML = resolve(html);

                var fragment = document.createDocumentFragment();
                while (wrapper.firstChild) {
                    fragment.appendChild(wrapper.firstChild);
                }
                el.parentNode.replaceChild(fragment, el);
            })
            .catch(function (err) {
                console.error('[partials] Falha ao carregar', url, err);
                el.innerHTML =
                    '<div class="alert alert-danger m-3" role="alert">' +
                    'Não foi possível carregar <code>' + url + '</code>. ' +
                    'Abra a página através do servidor HTTP (ex.: XAMPP).' +
                    '</div>';
            });
    }

    function loadAll() {
        var targets = Array.prototype.slice.call(
            document.querySelectorAll('[data-include]')
        );

        // Sequencial para preservar a ordem do DOM (header → sidebar → footer).
        return targets.reduce(function (chain, el) {
            return chain.then(function () { return inject(el); });
        }, Promise.resolve());
    }

    function marcarMenuAtivo() {
        if (!page) return;
        document.querySelectorAll('.sidebar-menu a[data-menu]').forEach(function (link) {
            if (link.getAttribute('data-menu') === page) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    function initSidebar() {
        var sidebar = document.getElementById('sidebar');
        var toggle = document.getElementById('sidebarToggle');
        var backdrop = document.getElementById('sidebarBackdrop');
        if (!sidebar) return;

        function fechar() {
            sidebar.classList.remove('show');
            if (backdrop) backdrop.classList.remove('show');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        }

        function abrir() {
            sidebar.classList.add('show');
            if (backdrop) backdrop.classList.add('show');
            if (toggle) toggle.setAttribute('aria-expanded', 'true');
        }

        if (toggle) {
            toggle.addEventListener('click', function () {
                sidebar.classList.contains('show') ? fechar() : abrir();
            });
        }
        if (backdrop) backdrop.addEventListener('click', fechar);

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') fechar();
        });

        // Ao passar para desktop, garante que o estado móvel é limpo.
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 992) fechar();
        });
    }

    function initFooter() {
        var year = document.getElementById('footerYear');
        if (year) year.textContent = new Date().getFullYear();
    }

    document.addEventListener('DOMContentLoaded', function () {
        loadAll().then(function () {
            marcarMenuAtivo();
            initSidebar();
            initFooter();
        });
    });
})();
