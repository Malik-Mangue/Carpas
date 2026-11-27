window.CARPAS_SIDEBAR = '<aside class="sidebar" role="navigation" aria-label="Menu Principal">\n  <div class="sidebar-header">\n    <div class="brand-badge">C</div>\n    <span class="brand-name">Carpas</span>\n    <span class="brand-tag">Gestão</span>\n  </div>\n\n  <nav class="sidebar-nav">\n    <div class="nav-item-standalone">\n      <a href="../dashboard/dashboard.html" class="nav-link-custom" data-nav="dashboard">\n        <img src="../../assets/icons/dashboard.svg" alt="" aria-hidden="true">\n        <span>Dashboard</span>\n      </a>\n    </div>\n\n    <div class="sidebar-section">\n      <div class="section-title">Estrutura Curricular</div>\n      <a href="../modulo/modulo.html" class="nav-link-custom" data-nav="modulo">\n        <img src="../../assets/icons/modulo.svg" alt="" aria-hidden="true">\n        <span>Módulo</span>\n      </a>\n      <a href="../qualificacao/qualificacao.html" class="nav-link-custom" data-nav="qualificacao">\n        <img src="../../assets/icons/qualificacao.svg" alt="" aria-hidden="true">\n        <span>Qualificação</span>\n      </a>\n      <a href="../nivel/nivel.html" class="nav-link-custom" data-nav="nivel">\n        <img src="../../assets/icons/nivel.svg" alt="" aria-hidden="true">\n        <span>Nível</span>\n      </a>\n      <a href="../licao/licao.html" class="nav-link-custom" data-nav="licao">\n        <img src="../../assets/icons/modulo.svg" alt="" aria-hidden="true">\n        <span>Lição</span>\n      </a>\n      <a href="../Campo/Campo.html" class="nav-link-custom" data-nav="Campo">\n        <img src="../../assets/icons/campo.svg" alt="" aria-hidden="true">\n        <span>Campo</span>\n      </a>\n      <a href="../sala/sala.html" class="nav-link-custom" data-nav="sala">\n        <img src="../../assets/icons/sala.svg" alt="" aria-hidden="true">\n        <span>Sala</span>\n      </a>\n    </div>\n\n    <div class="sidebar-section">\n      <div class="section-title">Formação</div>\n      <a href="../formadores/formadores.html" class="nav-link-custom" data-nav="formadores">\n        <img src="../../assets/icons/usuario.svg" alt="" aria-hidden="true">\n        <span>Formadores</span>\n      </a>\n      <a href="../formando/formando.html" class="nav-link-custom" data-nav="formando">\n        <img src="../../assets/icons/usuario.svg" alt="" aria-hidden="true">\n        <span>Formandos</span>\n      </a>\n      <a href="../turma/turma.html" class="nav-link-custom" data-nav="turma">\n        <img src="../../assets/icons/sala.svg" alt="" aria-hidden="true">\n        <span>Turmas</span>\n      </a>\n      <a href="../inscricao/inscricao.html" class="nav-link-custom" data-nav="inscricao">\n        <img src="../../assets/icons/qualificacao.svg" alt="" aria-hidden="true">\n        <span>Inscrições</span>\n      </a>\n      <a href="../matricula/matricula.html" class="nav-link-custom" data-nav="matricula">\n        <img src="../../assets/icons/qualificacao.svg" alt="" aria-hidden="true">\n        <span>Matrículas</span>\n      </a>\n    </div>\n\n    <div class="sidebar-section">\n      <div class="section-title">Administração</div>\n      <a href="../usuario/usuario.html" class="nav-link-custom" data-nav="usuario">\n        <img src="../../assets/icons/usuario.svg" alt="" aria-hidden="true">\n        <span>Usuário</span>\n      </a>\n      <a href="../perfil/perfil.html" class="nav-link-custom" data-nav="perfil">\n        <img src="../../assets/icons/perfis.svg" alt="" aria-hidden="true">\n        <span>Perfis</span>\n      </a>\n      <a href="../permissoes/permissoes.html" class="nav-link-custom" data-nav="permissoes">\n        <img src="../../assets/icons/perfis.svg" alt="" aria-hidden="true">\n        <span>Permissões</span>\n      </a>\n      <a href="../log/log.html" class="nav-link-custom" data-nav="log">\n        <img src="../../assets/icons/logs.svg" alt="" aria-hidden="true">\n        <span>Logs</span>\n      </a>\n    </div>\n  </nav>\n\n  <div class="sidebar-footer" id="profile-container">\n    <div class="profile-dropdown" id="profile-dropdown" role="menu" aria-label="Opções de perfil">\n      <button type="button" class="dropdown-item-custom" role="menuitem">\n        <img src="../../assets/icons/change-profile.svg" alt="" aria-hidden="true">\n        <span>Alterar perfil</span>\n      </button>\n      <button type="button" class="dropdown-item-custom item-danger" role="menuitem">\n        <img src="../../assets/icons/sign-out.svg" alt="" aria-hidden="true">\n        <span>Sign out</span>\n      </button>\n    </div>\n    <button type="button" class="profile-button" id="profile-trigger" aria-haspopup="true" aria-expanded="false" aria-controls="profile-dropdown">\n      <div class="profile-avatar">\n        <img src="../../assets/icons/perfil.svg" alt="" aria-hidden="true">\n      </div>\n      <div>\n        <div class="profile-name">Malik Mangue</div>\n        <div class="profile-role">Administrador</div>\n      </div>\n    </button>\n  </div>\n</aside>\n';
window.CARPAS_HEADER = '<header class="app-header">\n  <nav class="app-navbar" aria-label="Barra da página">\n    <div>\n      <h1 class="h3 font-weight-bold mb-1 app-page-title" data-page-title></h1>\n      <p class="text-muted mb-0" data-page-subtitle>Carpas — gestão de formação</p>\n    </div>\n    <span class="badge badge-golden-custom px-3 py-2">Identidade 2026 Ativa</span>\n  </nav>\n</header>\n';
(function () {
  var base = new URL("../../../componentes/", location.href);

  function mount(id, html) {
    var el = document.getElementById(id);
    if (el) el.outerHTML = html;
  }

  function activate() {
    var parts = decodeURIComponent(location.pathname).split("/").filter(Boolean);
    var folder = parts.length >= 2 ? parts[parts.length - 2] : "";
    var links = document.querySelectorAll(".sidebar a[data-nav]");
    for (var i = 0; i < links.length; i++) {
      var on = links[i].getAttribute("data-nav") === folder;
      links[i].classList.toggle("active", on);
      if (on) links[i].setAttribute("aria-current", "page");
      else links[i].removeAttribute("aria-current");
    }
    var heading = document.querySelector("main h2.h4, main .page-heading");
    var title = document.querySelector("[data-page-title]");
    if (title) {
      var fromDoc = document.title.replace(/^Carpas\s*[—-]\s*/, "").trim();
      title.textContent = heading ? heading.textContent.trim() : fromDoc;
    }
  }

  function profile() {
    var trigger = document.getElementById("profile-trigger");
    var dropdown = document.getElementById("profile-dropdown");
    var container = document.getElementById("profile-container");
    if (!trigger || !dropdown || !container) return;
    function toggle(open) {
      var isOpen = open !== undefined ? open : !dropdown.classList.contains("is-open");
      dropdown.classList.toggle("is-open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
    }
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      toggle();
    });
    document.addEventListener("click", function (e) {
      if (!container.contains(e.target)) toggle(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && dropdown.classList.contains("is-open")) {
        toggle(false);
        trigger.focus();
      }
    });
  }

  function apply(sidebar, header) {
    mount("sidebar", sidebar);
    mount("header", header);
    activate();
    profile();
  }

  if (location.protocol === "file:") {
    apply(window.CARPAS_SIDEBAR, window.CARPAS_HEADER);
    return;
  }
  Promise.all([
    fetch(new URL("sidebar.html", base)).then(function (r) {
      if (!r.ok) throw new Error("sidebar");
      return r.text();
    }),
    fetch(new URL("header.html", base)).then(function (r) {
      if (!r.ok) throw new Error("header");
      return r.text();
    })
  ]).then(function (parts) {
    apply(parts[0], parts[1]);
  }).catch(function () {
    apply(window.CARPAS_SIDEBAR, window.CARPAS_HEADER);
  });
})();
