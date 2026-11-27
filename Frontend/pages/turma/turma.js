/**
 * Página: Turmas (pages/turma/turma.js)
 * Carregada por src/js/utils/PageLoad.js depois do HTML entrar no #app.
 *
 * Sem backend: as listas começam vazias. Quando a API existir, preencher
 * `listaTurmas`, `CAMPOS`, `PARES_QUALI_NIVEL` e `DIRETORES` com os dados
 * vindos do servidor.
 */

(function () {
    "use strict";

    // ---------------------------------------------------------------- dados

    // Tabela `campo`: { codigo, nome }
    const CAMPOS = [
        { codigo: 1, nome: "Informática" },
        { codigo: 2, nome: "Gestão" }
    ];

    // Pares qualificação/nível (Quali_NivelController::listarPares):
    // { codigo, descricao, qualificacao, nivel, codCampo }
    const PARES_QUALI_NIVEL = [
        { codigo: 10, descricao: "Técnico de Informática — Nível 4", qualificacao: "Técnico de Informática", nivel: "Nível 4", codCampo: 1 },
        { codigo: 11, descricao: "Técnico de Gestão — Nível 4", qualificacao: "Técnico de Gestão", nivel: "Nível 4", codCampo: 2 }
    ];

    // Diretores de turma (TurmaController::listarDiretores):
    // { codigo, descricao, nome, codCampo }
    const DIRETORES = [
        { codigo: 1, descricao: "Carlos Silva", nome: "Carlos", codCampo: 1 },
        { codigo: 2, descricao: "Maria Sousa", nome: "Maria", codCampo: 2 }
    ];

    const TURNOS = ["Manhã", "Tarde", "Noite"];

    let listaTurmas = [
        {
            codigo: 1, nome: "TI-2025-A", anoLectivo: "2025", turno: "Manhã", capacidade: 30,
            codCampo: 1, campo: "Informática", idQualiNivel: 10, qualificacao: "Técnico de Informática",
            nivel: "Nível 4", codDiretor: 1, diretor: "Carlos Silva",
            formandos: [{ nome: "Ana", apelido: "Pereira" }, { nome: "Bruno", apelido: "Costa" }]
        }
    ];

    // ---------------------------------------------------------------- utils

    function escaparHtml(valor) {
        return String(valor == null ? "" : valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function encontrarTurma(codigo) {
        return listaTurmas.filter(function (turma) {
            return turma.codigo === Number(codigo);
        })[0];
    }

    function gerarProximoCodigo() {
        const maiorCodigo = listaTurmas.reduce(function (maior, turma) {
            return Math.max(maior, turma.codigo);
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

    function filtrarPorCampo(itens, codCampo) {
        if (!codCampo) return itens;

        return itens.filter(function (item) {
            return String(item.codCampo) === String(codCampo);
        });
    }

    function preencherCampo($selecao, codCampoSelecionado) {
        const opcoes = [{ valor: "", texto: "Selecione o campo..." }].concat(
            CAMPOS.map(function (campo) {
                return { valor: campo.codigo, texto: campo.nome };
            })
        );

        preencherSelecao($selecao, opcoes, codCampoSelecionado || "");
    }

    function preencherQualificacoes($selecao, codCampo, idSelecionado) {
        const paresFiltrados = filtrarPorCampo(PARES_QUALI_NIVEL, codCampo);

        const opcoes = [{ valor: "", texto: "Selecione..." }].concat(
            paresFiltrados.map(function (par) {
                return { valor: par.codigo, texto: par.descricao };
            })
        );

        preencherSelecao($selecao, opcoes, idSelecionado || "");
    }

    function preencherDiretores($selecao, codCampo, idSelecionado) {
        const diretoresFiltrados = filtrarPorCampo(DIRETORES, codCampo);

        const opcoes = [{ valor: "", texto: "Selecione..." }].concat(
            diretoresFiltrados.map(function (diretor) {
                return { valor: diretor.codigo, texto: diretor.descricao };
            })
        );

        preencherSelecao($selecao, opcoes, idSelecionado || "");
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

    // Validação equivalente à do TurmaController (PHP).
    function validarTurma(dadosTurma) {
        if (!dadosTurma.nome || dadosTurma.nome.length > 40) {
            return "O nome da turma é obrigatório (até 40 caracteres).";
        }

        if (!/^\d{4}$/.test(dadosTurma.anoLectivo)) {
            return "O ano lectivo deve ter 4 dígitos (ex.: 2025).";
        }

        if (TURNOS.indexOf(dadosTurma.turno) === -1) {
            return "Selecione um turno válido.";
        }

        if (!dadosTurma.codDiretor) {
            return "Selecione o diretor de turma.";
        }

        if (!dadosTurma.idQualiNivel) {
            return "Selecione a qualificação e o nível da turma.";
        }

        const capacidade = Number(dadosTurma.capacidade);

        if (!Number.isInteger(capacidade) || capacidade < 1 || capacidade > 200) {
            return "A capacidade máxima deve ser um número entre 1 e 200.";
        }

        return "";
    }

    // ---------------------------------------------------------------- tabela

    function filtrarTurmas() {
        const termoPesquisa = ($("#pesquisa").val() || "").trim().toLowerCase();

        if (!termoPesquisa) return listaTurmas;

        return listaTurmas.filter(function (turma) {
            return (turma.nome || "").toLowerCase().indexOf(termoPesquisa) !== -1;
        });
    }

    function renderizarTabela() {
        const $corpoTabela = $("#tbodyTurmas");
        if (!$corpoTabela.length) return;

        const turmasFiltradas = filtrarTurmas();

        if (!turmasFiltradas.length) {
            $corpoTabela.html(
                '<tr><td colspan="10" class="text-center text-muted py-4">' +
                "Nenhuma turma cadastrada no momento.</td></tr>"
            );
            return;
        }

        $corpoTabela.html(turmasFiltradas.map(function (turma) {
            return "" +
                "<tr>" +
                "<td><strong>#" + escaparHtml(turma.codigo) + "</strong></td>" +
                "<td>" + escaparHtml(turma.nome) + "</td>" +
                "<td>" + escaparHtml(turma.anoLectivo) + "</td>" +
                "<td>" + escaparHtml(turma.turno) + "</td>" +
                "<td>" + escaparHtml(turma.capacidade) + "</td>" +
                "<td>" + escaparHtml(turma.diretor || "-") + "</td>" +
                "<td>" + escaparHtml(turma.qualificacao || "-") + "</td>" +
                '<td class="d-none d-xl-table-cell">' + escaparHtml(turma.campo || "-") + "</td>" +
                '<td class="d-none d-xl-table-cell">' + escaparHtml(turma.nivel || "-") + "</td>" +
                '<td class="text-right text-nowrap">' +
                    '<button type="button" class="btn btn-sm btn-outline-secondary px-1" ' +
                        'data-acao="detalhes" data-codigo="' + turma.codigo + '" ' +
                        'title="Ver detalhes" aria-label="Ver detalhes">' +
                        '<svg class="icon icon-sm"><use href="#i-ver"></use></svg></button> ' +
                    '<button type="button" class="btn btn-sm btn-outline-primary px-1" ' +
                        'data-acao="editar" data-codigo="' + turma.codigo + '" ' +
                        'title="Editar" aria-label="Editar">' +
                        '<svg class="icon icon-sm"><use href="#i-editar"></use></svg></button> ' +
                    '<button type="button" class="btn btn-sm btn-outline-danger px-1" ' +
                        'data-acao="remover" data-codigo="' + turma.codigo + '" ' +
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

        preencherCampo($("#novo-campo"), "");
        preencherQualificacoes($("#novo-qualiNivel"), "", "");
        preencherDiretores($("#novo-diretor"), "", "");
        preencherSelecao($("#novo-turno"), [{ valor: "", texto: "Selecione..." }].concat(TURNOS), "");

        abrirModal("modalNovo");
    }

    function abrirFormularioEdicao(codigo) {
        const turma = encontrarTurma(codigo);
        if (!turma) return;

        $("#edit-codigo").val(turma.codigo);
        $("#edit-nome").val(turma.nome);
        $("#edit-ano").val(turma.anoLectivo);
        $("#edit-capacidade").val(turma.capacidade);

        preencherCampo($("#edit-campo"), turma.codCampo);
        preencherQualificacoes($("#edit-qualiNivel"), turma.codCampo, turma.idQualiNivel);
        preencherDiretores($("#edit-diretor"), turma.codCampo, turma.codDiretor);
        preencherSelecao($("#edit-turno"), [{ valor: "", texto: "Selecione..." }].concat(TURNOS), turma.turno);

        abrirModal("modalEditar");
    }

    function abrirConfirmacaoRemocao(codigo) {
        const turma = encontrarTurma(codigo);
        if (!turma) return;

        $("#del-codigo").val(turma.codigo);
        $("#del-detalhes").html(
            '<p class="mb-1"><strong>Código:</strong> #' + escaparHtml(turma.codigo) + "</p>" +
            '<p class="mb-1"><strong>Nome:</strong> ' + escaparHtml(turma.nome) + "</p>" +
            '<p class="mb-1"><strong>Ano lectivo:</strong> ' + escaparHtml(turma.anoLectivo) + "</p>" +
            '<p class="mb-1"><strong>Turno:</strong> ' + escaparHtml(turma.turno) + "</p>" +
            '<p class="mb-0"><strong>Capacidade máxima:</strong> ' + escaparHtml(turma.capacidade) + "</p>"
        );

        abrirModal("modalDeletar");
    }

    function abrirDetalhes(codigo) {
        const turma = encontrarTurma(codigo);
        if (!turma) return;

        $("#tituloDetalhes").text("Turma #" + turma.codigo + " — " + turma.nome);

        const formandos = turma.formandos || [];

        let tabelaFormandos;

        if (!formandos.length) {
            tabelaFormandos = '<p class="text-muted small mb-0">' +
                "Nenhum estudante associado a esta turma no momento.</p>";
        } else {
            tabelaFormandos = formandos.map(function (formando, indice) {
                return "<tr>" +
                    "<td><strong>" + (indice + 1) + "</strong></td>" +
                    "<td>" + escaparHtml(formando.nome) + "</td>" +
                    "<td>" + escaparHtml(formando.apelido) + "</td>" +
                    "</tr>";
            }).join("");
        }

        $("#detalhesConteudo").html(
            '<div class="border rounded p-3 mb-4">' +
                '<p class="mb-1"><strong>Qualificação / Nível:</strong> ' +
                    escaparHtml(turma.qualificacao || "-") + " — " + escaparHtml(turma.nivel || "-") + "</p>" +
                '<p class="mb-1"><strong>Diretor de Turma:</strong> ' + escaparHtml(turma.diretor || "-") + "</p>" +
                '<p class="mb-1"><strong>Ano Lectivo:</strong> ' + escaparHtml(turma.anoLectivo) + "</p>" +
                '<p class="mb-0"><strong>Turno:</strong> ' + escaparHtml(turma.turno) + "</p>" +
            "</div>" +
            '<h6 class="text-uppercase text-muted small font-weight-bold">' +
                "Estudantes (" + formandos.length + ")</h6>" +
            '<div class="table-responsive"><table class="table table-sm table-bordered mb-0">' +
                '<thead class="thead-light"><tr><th>Número</th><th>Nome</th><th>Apelido</th></tr></thead>' +
                "<tbody>" + tabelaFormandos + "</tbody></table></div>"
        );

        abrirModal("modalDetalhes");
    }

    // ---------------------------------------------------------------- eventos

    function obterDadosDoFormulario(prefixo) {
        const campoSelecionado = $("#" + prefixo + "-campo").val();
        const idQualiNivel = $("#" + prefixo + "-qualiNivel").val();
        const codDiretor = $("#" + prefixo + "-diretor").val();

        const parQualiNivel = PARES_QUALI_NIVEL.filter(function (par) {
            return String(par.codigo) === String(idQualiNivel);
        })[0];

        const diretor = DIRETORES.filter(function (item) {
            return String(item.codigo) === String(codDiretor);
        })[0];

        const campo = CAMPOS.filter(function (item) {
            return String(item.codigo) === String(campoSelecionado);
        })[0];

        return {
            nome: $("#" + prefixo + "-nome").val().trim(),
            anoLectivo: $("#" + prefixo + "-ano").val().trim(),
            turno: $("#" + prefixo + "-turno").val(),
            capacidade: $("#" + prefixo + "-capacidade").val().trim(),
            codCampo: campoSelecionado ? Number(campoSelecionado) : null,
            campo: campo ? campo.nome : "",
            idQualiNivel: idQualiNivel ? Number(idQualiNivel) : null,
            qualificacao: parQualiNivel ? (parQualiNivel.qualificacao || parQualiNivel.descricao) : "",
            nivel: parQualiNivel ? (parQualiNivel.nivel || "-") : "",
            codDiretor: codDiretor ? Number(codDiretor) : null,
            diretor: diretor ? diretor.descricao : ""
        };
    }

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

        // Ao mudar o campo, recarregar qualificações/níveis e diretores desse campo.
        $("#novo-campo").on("change", function () {
            const codCampo = $(this).val();

            preencherQualificacoes($("#novo-qualiNivel"), codCampo, "");
            preencherDiretores($("#novo-diretor"), codCampo, "");
        });

        $("#edit-campo").on("change", function () {
            const codCampo = $(this).val();

            preencherQualificacoes($("#edit-qualiNivel"), codCampo, "");
            preencherDiretores($("#edit-diretor"), codCampo, "");
        });

        $("#tbodyTurmas").on("click", "[data-acao]", function () {
            const $botaoAcao = $(this);
            const codigoTurma = $botaoAcao.data("codigo");
            const tipoAcao = $botaoAcao.data("acao");

            if (tipoAcao === "editar") abrirFormularioEdicao(codigoTurma);
            if (tipoAcao === "remover") abrirConfirmacaoRemocao(codigoTurma);
            if (tipoAcao === "detalhes") abrirDetalhes(codigoTurma);
        });

        // gravar nova turma
        $("#formNovo").on("submit", function (evento) {
            evento.preventDefault();

            const dadosTurma = obterDadosDoFormulario("novo");
            const erroValidacao = validarTurma(dadosTurma);

            if (erroValidacao) {
                mostrarMensagem("danger", erroValidacao);
                return;
            }

            listaTurmas.push({
                codigo: gerarProximoCodigo(),
                nome: dadosTurma.nome,
                anoLectivo: dadosTurma.anoLectivo,
                turno: dadosTurma.turno,
                capacidade: Number(dadosTurma.capacidade),
                codCampo: dadosTurma.codCampo,
                campo: dadosTurma.campo,
                idQualiNivel: dadosTurma.idQualiNivel,
                qualificacao: dadosTurma.qualificacao,
                nivel: dadosTurma.nivel,
                codDiretor: dadosTurma.codDiretor,
                diretor: dadosTurma.diretor,
                formandos: []
            });

            renderizarTabela();
            $("#modalNovo").modal("hide");
            mostrarMensagem("success", "Turma cadastrada com sucesso!");
        });

        // gravar edição
        $("#formEditar").on("submit", function (evento) {
            evento.preventDefault();

            const turmaEmEdicao = encontrarTurma($("#edit-codigo").val());
            if (!turmaEmEdicao) return;

            const dadosTurma = obterDadosDoFormulario("edit");
            const erroValidacao = validarTurma(dadosTurma);

            if (erroValidacao) {
                mostrarMensagem("danger", erroValidacao);
                return;
            }

            turmaEmEdicao.nome = dadosTurma.nome;
            turmaEmEdicao.anoLectivo = dadosTurma.anoLectivo;
            turmaEmEdicao.turno = dadosTurma.turno;
            turmaEmEdicao.capacidade = Number(dadosTurma.capacidade);
            turmaEmEdicao.codCampo = dadosTurma.codCampo;
            turmaEmEdicao.campo = dadosTurma.campo;
            turmaEmEdicao.idQualiNivel = dadosTurma.idQualiNivel;
            turmaEmEdicao.qualificacao = dadosTurma.qualificacao;
            turmaEmEdicao.nivel = dadosTurma.nivel;
            turmaEmEdicao.codDiretor = dadosTurma.codDiretor;
            turmaEmEdicao.diretor = dadosTurma.diretor;

            renderizarTabela();
            $("#modalEditar").modal("hide");
            mostrarMensagem("success", "Turma atualizada com sucesso!");
        });

        // confirmar remoção
        $("#formDeletar").on("submit", function (evento) {
            evento.preventDefault();

            const codigoRemover = Number($("#del-codigo").val());

            listaTurmas = listaTurmas.filter(function (turma) {
                return turma.codigo !== codigoRemover;
            });

            renderizarTabela();
            $("#modalDeletar").modal("hide");
            mostrarMensagem("success", "Turma removida com sucesso!");
        });
    }

    // ---------------------------------------------------------------- arranque

    preencherCampo($("#novo-campo"), "");
    preencherQualificacoes($("#novo-qualiNivel"), "", "");
    preencherDiretores($("#novo-diretor"), "", "");
    preencherSelecao($("#novo-turno"), [{ valor: "", texto: "Selecione..." }].concat(TURNOS), "");

    preencherCampo($("#edit-campo"), "");
    preencherQualificacoes($("#edit-qualiNivel"), "", "");
    preencherDiretores($("#edit-diretor"), "", "");
    preencherSelecao($("#edit-turno"), [{ valor: "", texto: "Selecione..." }].concat(TURNOS), "");

    registrarEventos();
    renderizarTabela();
})();
