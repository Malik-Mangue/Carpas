/**
 * Página: Formandos (pages/formandos/formandos.js)
 * Carregada por src/js/utils/PageLoad.js depois do HTML entrar no #app.
 *
 * Sem backend: a lista começa vazia. Quando a API existir, preencher
 * `listaFormandos` com os registos devolvidos pelo servidor.
 */

(function () {
    "use strict";

    // ---------------------------------------------------------------- dados

    // Campos de formação: virão da tabela `campo` pela API.
    const CAMPOS = ["Informática", "Gestão", "Electrónica", "Contabilidade", "Saúde"];

    let listaFormandos = [
        { codigo: 1, nome: "Ana", apelido: "Pereira", codCampo: 1, campo: "Informática", contacto: "911111111", email: "ana.pereira@exemplo.pt", bi: "001234567LA045" },
        { codigo: 2, nome: "Bruno", apelido: "Costa", codCampo: 2, campo: "Gestão", contacto: "", email: "", bi: "002345678LA046" }
    ];

    // ---------------------------------------------------------------- utils

    function escaparHtml(valor) {
        return String(valor == null ? "" : valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function encontrarFormando(codigo) {
        return listaFormandos.filter(function (formando) {
            return formando.codigo === Number(codigo);
        })[0];
    }

    function gerarProximoCodigo() {
        const maiorCodigo = listaFormandos.reduce(function (maior, formando) {
            return Math.max(maior, formando.codigo);
        }, 0);

        return maiorCodigo + 1;
    }

    function preencherSelecao($selecao, opcoes, valorSelecionado) {
        if (!$selecao.length) return;

        const opcoesHtml = opcoes.map(function (opcao) {
            const itemOpcao = typeof opcao === "object" ? opcao : { valor: opcao, texto: opcao };
            const estaSelecionado = String(itemOpcao.valor) === String(valorSelecionado) ? " selected" : "";

            return "<option value=\"" + escaparHtml(itemOpcao.valor) + "\"" + estaSelecionado + ">" +
                escaparHtml(itemOpcao.texto) + "</option>";
        }).join("");

        $selecao.html(opcoesHtml);
    }

    function mostrarMensagem(tipo, mensagem) {
        const $caixaMensagens = $("#flash");
        if (!$caixaMensagens.length) return;

        $caixaMensagens.html(
            '<div class="alert alert-' + escaparHtml(tipo) + ' alert-dismissible fade show" role="alert">' +
            escaparHtml(mensagem) +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Fechar">' +
            '<span aria-hidden="true">&times;</span></button></div>'
        );

        window.setTimeout(function () {
            $caixaMensagens.find(".alert").alert("close");
        }, 4000);
    }

    // Validação equivalente à do FormandoController (PHP).
    function validarFormando(dadosFormando) {
        if (!dadosFormando.nome || !dadosFormando.apelido || !dadosFormando.bi) {
            return "Os campos nome, apelido e nº do BI não podem estar vazios.";
        }

        if (!dadosFormando.campo) {
            return "Selecione o campo (área) do formando.";
        }

        if (dadosFormando.nome.length > 100 || dadosFormando.apelido.length > 100 ||
            dadosFormando.email.length > 100 || dadosFormando.bi.length > 20) {
            return "Não foi possível gravar o registo. Nome/apelido até 100, e-mail até 100 " +
                "e nº do BI até 20 caracteres.";
        }

        if (dadosFormando.contacto !== "" && !/^\d+$/.test(dadosFormando.contacto)) {
            return "O contacto deve conter apenas dígitos.";
        }

        return "";
    }

    // ---------------------------------------------------------------- tabela

    function filtrarFormandos() {
        const termoPesquisa = ($("#pesquisa").val() || "").trim().toLowerCase();

        if (!termoPesquisa) return listaFormandos;

        return listaFormandos.filter(function (formando) {
            const textoPesquisavel = [
                formando.nome,
                formando.apelido,
                formando.contacto,
                formando.email,
                formando.bi
            ].join(" ").toLowerCase();

            return textoPesquisavel.indexOf(termoPesquisa) !== -1;
        });
    }

    function renderizarTabela() {
        const $corpoTabela = $("#tbodyFormandos");
        if (!$corpoTabela.length) return;

        const formandosFiltrados = filtrarFormandos();

        if (!formandosFiltrados.length) {
            $corpoTabela.html(
                '<tr><td colspan="8" class="text-center text-muted py-4">' +
                "Nenhum formando encontrado.</td></tr>"
            );
            return;
        }

        $corpoTabela.html(formandosFiltrados.map(function (formando) {
            return "" +
                "<tr>" +
                "<td><strong>#" + escaparHtml(formando.codigo) + "</strong></td>" +
                "<td>" + escaparHtml(formando.nome) + "</td>" +
                "<td>" + escaparHtml(formando.apelido) + "</td>" +
                "<td>" + escaparHtml(formando.campo || "-") + "</td>" +
                "<td>" + escaparHtml(formando.contacto || "-") + "</td>" +
                '<td class="d-none d-lg-table-cell">' + escaparHtml(formando.email || "-") + "</td>" +
                "<td>" + escaparHtml(formando.bi) + "</td>" +
                '<td class="text-right text-nowrap">' +
                    '<button type="button" class="btn btn-sm btn-outline-primary px-1" ' +
                        'data-acao="editar" data-codigo="' + formando.codigo + '" ' +
                        'title="Editar" aria-label="Editar">' +
                        '<svg class="icon icon-sm"><use href="#i-editar"></use></svg></button> ' +
                    '<button type="button" class="btn btn-sm btn-outline-danger px-1" ' +
                        'data-acao="remover" data-codigo="' + formando.codigo + '" ' +
                        'title="Remover" aria-label="Remover">' +
                        '<svg class="icon icon-sm"><use href="#i-remover"></use></svg></button>' +
                "</td>" +
                "</tr>";
        }).join(""));
    }

    // ---------------------------------------------------------------- modais

    function abrirModal(idModal) {
        $("#" + idModal).modal("show");
    }

    function abrirFormularioNovo() {
        $("#formNovo")[0].reset();

        preencherSelecao($("#novo-campo"), CAMPOS, "");
        abrirModal("modalNovo");
    }

    function abrirFormularioEdicao(codigo) {
        const formando = encontrarFormando(codigo);
        if (!formando) return;

        $("#edit-codigo").val(formando.codigo);
        $("#edit-nome").val(formando.nome);
        $("#edit-apelido").val(formando.apelido);
        $("#edit-contacto").val(formando.contacto || "");
        $("#edit-email").val(formando.email || "");
        $("#edit-bi").val(formando.bi);

        preencherSelecao($("#edit-campo"), CAMPOS, formando.campo);

        abrirModal("modalEditar");
    }

    function abrirConfirmacaoRemocao(codigo) {
        const formando = encontrarFormando(codigo);
        if (!formando) return;

        $("#del-codigo").val(formando.codigo);
        $("#del-detalhes").html(
            '<p class="mb-1"><strong>Código:</strong> #' + escaparHtml(formando.codigo) + "</p>" +
            '<p class="mb-1"><strong>Nome:</strong> ' + escaparHtml(formando.nome) + "</p>" +
            '<p class="mb-1"><strong>Apelido:</strong> ' + escaparHtml(formando.apelido) + "</p>" +
            '<p class="mb-1"><strong>Campo:</strong> ' + escaparHtml(formando.campo || "-") + "</p>" +
            '<p class="mb-0"><strong>Nº do BI:</strong> ' + escaparHtml(formando.bi) + "</p>"
        );

        abrirModal("modalDeletar");
    }

    // ---------------------------------------------------------------- eventos

    function registrarEventos() {
        $("#formPesquisa").on("submit", function (evento) {
            evento.preventDefault();
            renderizarTabela();
        });

        $("#pesquisa").on("input", renderizarTabela);

        $("#btnLimpar").on("click", function () {
            $("#pesquisa").val("").trigger("focus");
            renderizarTabela();
        });

        $("#btnNovo").on("click", abrirFormularioNovo);

        $("#tbodyFormandos").on("click", "[data-acao]", function () {
            const $botaoAcao = $(this);
            const codigoFormando = $botaoAcao.data("codigo");
            const tipoAcao = $botaoAcao.data("acao");

            if (tipoAcao === "editar") abrirFormularioEdicao(codigoFormando);
            if (tipoAcao === "remover") abrirConfirmacaoRemocao(codigoFormando);
        });

        // gravar novo formando
        $("#formNovo").on("submit", function (evento) {
            evento.preventDefault();

            const campoSelecionado = $("#novo-campo").val();

            const novoFormando = {
                codigo: gerarProximoCodigo(),
                nome: $("#novo-nome").val().trim(),
                apelido: $("#novo-apelido").val().trim(),
                codCampo: CAMPOS.indexOf(campoSelecionado) + 1,
                campo: campoSelecionado,
                contacto: $("#novo-contacto").val().trim(),
                email: $("#novo-email").val().trim(),
                bi: $("#novo-bi").val().trim()
            };

            const erroValidacao = validarFormando(novoFormando);
            if (erroValidacao) {
                mostrarMensagem("danger", erroValidacao);
                return;
            }

            listaFormandos.push(novoFormando);
            renderizarTabela();
            $("#modalNovo").modal("hide");
            mostrarMensagem("success", "Formando cadastrado com sucesso!");
        });

        // gravar edição
        $("#formEditar").on("submit", function (evento) {
            evento.preventDefault();

            const formandoEmEdicao = encontrarFormando($("#edit-codigo").val());
            if (!formandoEmEdicao) return;

            const campoSelecionado = $("#edit-campo").val();

            const dadosAtualizados = {
                nome: $("#edit-nome").val().trim(),
                apelido: $("#edit-apelido").val().trim(),
                contacto: $("#edit-contacto").val().trim(),
                email: $("#edit-email").val().trim(),
                bi: $("#edit-bi").val().trim(),
                campo: campoSelecionado
            };

            const erroValidacao = validarFormando(dadosAtualizados);
            if (erroValidacao) {
                mostrarMensagem("danger", erroValidacao);
                return;
            }

            formandoEmEdicao.nome = dadosAtualizados.nome;
            formandoEmEdicao.apelido = dadosAtualizados.apelido;
            formandoEmEdicao.contacto = dadosAtualizados.contacto;
            formandoEmEdicao.email = dadosAtualizados.email;
            formandoEmEdicao.bi = dadosAtualizados.bi;
            formandoEmEdicao.campo = dadosAtualizados.campo;
            formandoEmEdicao.codCampo = CAMPOS.indexOf(dadosAtualizados.campo) + 1;

            renderizarTabela();
            $("#modalEditar").modal("hide");
            mostrarMensagem("success", "Formando atualizado com sucesso!");
        });

        // confirmar remoção
        $("#formDeletar").on("submit", function (evento) {
            evento.preventDefault();

            const codigoRemover = Number($("#del-codigo").val());

            listaFormandos = listaFormandos.filter(function (formando) {
                return formando.codigo !== codigoRemover;
            });

            renderizarTabela();
            $("#modalDeletar").modal("hide");
            mostrarMensagem("success", "Formando removido com sucesso!");
        });
    }

    // ---------------------------------------------------------------- arranque

    preencherSelecao($("#novo-campo"), CAMPOS, "");
    preencherSelecao($("#edit-campo"), CAMPOS, "");

    registrarEventos();
    renderizarTabela();
})();
