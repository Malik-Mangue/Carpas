/**
 * Página: Matrículas (pages/matricula/matricula.js)
 * Carregada por src/js/utils/PageLoad.js depois do HTML entrar no #app.
 *
 * Sem backend: as listas começam vazias. Quando a API existir, preencher
 * `listaMatriculas`, `CAMPOS`, `PARES_QUALI_NIVEL`, `FORMANDOS` e `TURMAS`
 * com os dados devolvidos pelo servidor.
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
    // { codigo, descricao, qualificacao, nivel, codQualificacao, codCampo }
    const PARES_QUALI_NIVEL = [
        { codigo: 10, descricao: "Técnico de Informática — Nível 4", qualificacao: "Técnico de Informática", nivel: "Nível 4", codQualificacao: 100, codCampo: 1 },
        { codigo: 11, descricao: "Técnico de Gestão — Nível 4", qualificacao: "Técnico de Gestão", nivel: "Nível 4", codQualificacao: 200, codCampo: 2 }
    ];

    // Formandos (FormandoController::listar):
    // { codigo, nome, apelido, descricao, codCampo }
    const FORMANDOS = [
        { codigo: 1, nome: "Ana", apelido: "Pereira", descricao: "Ana Pereira", codCampo: 1 },
        { codigo: 2, nome: "Bruno", apelido: "Costa", descricao: "Bruno Costa", codCampo: 2 }
    ];

    // Turmas (TurmaController::listarTurma):
    // { codigo, nome, anoLectivo, codQualificacao }
    const TURMAS = [
        { codigo: 1, nome: "TI-2025-A", anoLectivo: "2025", codQualificacao: 100 },
        { codigo: 2, nome: "TI-2024-B", anoLectivo: "2024", codQualificacao: 100 }
    ];

    let listaMatriculas = [
        {
            codigo: 1, codFormando: 1, formando: "Ana Pereira", idQualiNivel: 10,
            qualificacao: "Técnico de Informática", nivel: "Nível 4", codQualificacao: 100,
            codCampo: 1, campo: "Informática", codTurma: 1, turma: "TI-2025-A", data: "2025-09-15"
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

    function normalizarTexto(valor) {
        return String(valor == null ? "" : valor)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function encontrarMatricula(codigo) {
        return listaMatriculas.filter(function (matricula) {
            return matricula.codigo === Number(codigo);
        })[0];
    }

    function encontrarPar(idQualiNivel) {
        return PARES_QUALI_NIVEL.filter(function (par) {
            return String(par.codigo) === String(idQualiNivel);
        })[0];
    }

    function gerarProximoCodigo() {
        const maiorCodigo = listaMatriculas.reduce(function (maior, matricula) {
            return Math.max(maior, matricula.codigo);
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

    function preencherCampo($selecao, codCampoSelecionado) {
        const opcoes = [{ valor: "", texto: "Selecione o campo..." }].concat(
            CAMPOS.map(function (campo) {
                return { valor: campo.codigo, texto: campo.nome };
            })
        );

        preencherSelecao($selecao, opcoes, codCampoSelecionado || "");
    }

    function preencherQualificacoes($selecao, codCampo, idSelecionado) {
        const paresFiltrados = codCampo
            ? PARES_QUALI_NIVEL.filter(function (par) {
                return String(par.codCampo) === String(codCampo);
            })
            : PARES_QUALI_NIVEL;

        const opcoes = [{ valor: "", texto: "Selecione a qualificação e o nível..." }].concat(
            paresFiltrados.map(function (par) {
                return { valor: par.codigo, texto: par.descricao };
            })
        );

        preencherSelecao($selecao, opcoes, idSelecionado || "");
    }

    function preencherTurmas($selecao, codQualificacao, anoLectivo, idSelecionado) {
        if (!codQualificacao) {
            preencherSelecao($selecao, [{ valor: "", texto: "Sem turma" }], "");
            return;
        }

        const turmasFiltradas = TURMAS.filter(function (turma) {
            if (String(turma.codQualificacao) !== String(codQualificacao)) {
                return false;
            }

            return !anoLectivo || String(turma.anoLectivo) === String(anoLectivo);
        });

        const opcoes = [{ valor: "", texto: "Sem turma" }].concat(
            turmasFiltradas.map(function (turma) {
                return { valor: turma.codigo, texto: turma.nome + " (" + turma.anoLectivo + ")" };
            })
        );

        preencherSelecao($selecao, opcoes, idSelecionado || "");
    }

    function preencherFormandos($selecao, codCampo, termoBusca, idSelecionado) {
        let formandosFiltrados = codCampo
            ? FORMANDOS.filter(function (formando) {
                return String(formando.codCampo) === String(codCampo);
            })
            : FORMANDOS;

        const termoNormalizado = normalizarTexto(termoBusca);

        if (termoNormalizado) {
            formandosFiltrados = formandosFiltrados.filter(function (formando) {
                return normalizarTexto(formando.descricao).indexOf(termoNormalizado) !== -1;
            });
        }

        if (!formandosFiltrados.length) {
            preencherSelecao($selecao, [{ valor: "", texto: "Nenhum formando encontrado" }], "");
            return;
        }

        const opcoes = formandosFiltrados.map(function (formando) {
            return { valor: formando.codigo, texto: formando.descricao };
        });

        preencherSelecao($selecao, opcoes, idSelecionado || "");
    }

    function anoDaData(data) {
        const correspondencia = /^(\d{4})-\d{2}-\d{2}$/.exec(data || "");
        return correspondencia ? correspondencia[1] : null;
    }

    function dataValida(data) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data || "")) return false;

        const partes = data.split("-");
        const ano = Number(partes[0]);
        const mes = Number(partes[1]);
        const dia = Number(partes[2]);
        const dataVerificada = new Date(ano, mes - 1, dia);

        return dataVerificada.getFullYear() === ano &&
            dataVerificada.getMonth() === mes - 1 &&
            dataVerificada.getDate() === dia;
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

    // Validação equivalente à do MatriculaController (PHP).
    function validarMatricula(dadosMatricula) {
        if (!dadosMatricula.codFormando) {
            return "Selecione o formando.";
        }

        if (!dadosMatricula.idQualiNivel) {
            return "Selecione a qualificação e o nível.";
        }

        if (!dataValida(dadosMatricula.data)) {
            return "Indique uma data de matrícula válida.";
        }

        return "";
    }

    // ---------------------------------------------------------------- tabela

    function filtrarMatriculas() {
        const termoPesquisa = ($("#pesquisa").val() || "").trim().toLowerCase();

        if (!termoPesquisa) return listaMatriculas;

        return listaMatriculas.filter(function (matricula) {
            return (matricula.formando || "").toLowerCase().indexOf(termoPesquisa) !== -1;
        });
    }

    function renderizarTabela() {
        const $corpoTabela = $("#tbodyMatriculas");
        if (!$corpoTabela.length) return;

        const matriculasFiltradas = filtrarMatriculas();

        if (!matriculasFiltradas.length) {
            $corpoTabela.html(
                '<tr><td colspan="8" class="text-center text-muted py-4">' +
                "Nenhuma matrícula registada no momento.</td></tr>"
            );
            return;
        }

        $corpoTabela.html(matriculasFiltradas.map(function (matricula) {
            return "" +
                "<tr>" +
                "<td><strong>#" + escaparHtml(matricula.codigo) + "</strong></td>" +
                "<td>" + escaparHtml(matricula.formando) + "</td>" +
                "<td>" + escaparHtml(matricula.qualificacao || "-") + "</td>" +
                '<td class="d-none d-xl-table-cell">' + escaparHtml(matricula.campo || "-") + "</td>" +
                '<td class="d-none d-lg-table-cell">' + escaparHtml(matricula.nivel || "-") + "</td>" +
                "<td>" + escaparHtml(matricula.turma || "-") + "</td>" +
                "<td>" + escaparHtml(matricula.data) + "</td>" +
                '<td class="text-right text-nowrap">' +
                    '<button type="button" class="btn btn-sm btn-outline-primary px-1" ' +
                        'data-acao="editar" data-codigo="' + matricula.codigo + '" ' +
                        'title="Editar" aria-label="Editar">' +
                        '<svg class="icon icon-sm"><use href="#i-editar"></use></svg></button> ' +
                    '<button type="button" class="btn btn-sm btn-outline-danger px-1" ' +
                        'data-acao="remover" data-codigo="' + matricula.codigo + '" ' +
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
        preencherTurmas($("#novo-turma"), "", "", "");
        preencherFormandos($("#novo-formando"), "", "", "");

        abrirModal("modalNovo");
    }

    function abrirFormularioEdicao(codigo) {
        const matricula = encontrarMatricula(codigo);
        if (!matricula) return;

        $("#edit-codigo").val(matricula.codigo);
        $("#edit-data").val(matricula.data);
        $("#edit-buscaFormando").val("");

        preencherCampo($("#edit-campo"), matricula.codCampo);
        preencherQualificacoes($("#edit-qualiNivel"), matricula.codCampo, matricula.idQualiNivel);
        preencherTurmas($("#edit-turma"), matricula.codQualificacao,
            anoDaData(matricula.data), matricula.codTurma);
        preencherFormandos($("#edit-formando"), matricula.codCampo, "", matricula.codFormando);

        abrirModal("modalEditar");
    }

    function abrirConfirmacaoRemocao(codigo) {
        const matricula = encontrarMatricula(codigo);
        if (!matricula) return;

        $("#del-codigo").val(matricula.codigo);
        $("#del-detalhes").html(
            '<p class="mb-1"><strong>Código:</strong> #' + escaparHtml(matricula.codigo) + "</p>" +
            '<p class="mb-1"><strong>Formando:</strong> ' + escaparHtml(matricula.formando) + "</p>" +
            '<p class="mb-1"><strong>Turma:</strong> ' + escaparHtml(matricula.turma || "-") + "</p>" +
            '<p class="mb-0"><strong>Data:</strong> ' + escaparHtml(matricula.data) + "</p>"
        );

        abrirModal("modalDeletar");
    }

    // ---------------------------------------------------------------- eventos

    function obterDadosDoFormulario(prefixo) {
        const idQualiNivel = $("#" + prefixo + "-qualiNivel").val();
        const codFormando = $("#" + prefixo + "-formando").val();
        const codTurma = $("#" + prefixo + "-turma").val();

        const parQualiNivel = encontrarPar(idQualiNivel);

        const formando = FORMANDOS.filter(function (item) {
            return String(item.codigo) === String(codFormando);
        })[0];

        const turma = TURMAS.filter(function (item) {
            return String(item.codigo) === String(codTurma);
        })[0];

        const campo = CAMPOS.filter(function (item) {
            return parQualiNivel && String(item.codigo) === String(parQualiNivel.codCampo);
        })[0];

        return {
            codFormando: codFormando ? Number(codFormando) : null,
            formando: formando ? formando.descricao : "",
            idQualiNivel: idQualiNivel ? Number(idQualiNivel) : null,
            qualificacao: parQualiNivel ? parQualiNivel.qualificacao : "",
            nivel: parQualiNivel ? (parQualiNivel.nivel || "-") : "",
            codQualificacao: parQualiNivel ? parQualiNivel.codQualificacao : null,
            codCampo: parQualiNivel ? parQualiNivel.codCampo : null,
            campo: campo ? campo.nome : "",
            codTurma: turma ? Number(turma.codigo) : null,
            turma: turma ? turma.nome : "",
            data: $("#" + prefixo + "-data").val()
        };
    }

    function atualizarTurmasDoFormulario(prefixo, idSelecionado) {
        const idQualiNivel = $("#" + prefixo + "-qualiNivel").val();
        const data = $("#" + prefixo + "-data").val();
        const parQualiNivel = encontrarPar(idQualiNivel);

        preencherTurmas(
            $("#" + prefixo + "-turma"),
            parQualiNivel ? parQualiNivel.codQualificacao : "",
            anoDaData(data),
            idSelecionado || ""
        );
    }

    function registrarEventosDoFormulario(prefixo) {
        $("#" + prefixo + "-campo").on("change", function () {
            const codCampo = $(this).val();

            preencherQualificacoes($("#" + prefixo + "-qualiNivel"), codCampo, "");
            preencherTurmas($("#" + prefixo + "-turma"), "", "", "");
            preencherFormandos($("#" + prefixo + "-formando"), codCampo, "", "");
        });

        $("#" + prefixo + "-qualiNivel").on("change", function () {
            atualizarTurmasDoFormulario(prefixo);
        });

        $("#" + prefixo + "-data").on("change", function () {
            atualizarTurmasDoFormulario(prefixo);
        });

        $("#" + prefixo + "-buscaFormando").on("input", function () {
            const codCampo = $("#" + prefixo + "-campo").val();
            const formandoSelecionado = $("#" + prefixo + "-formando").val();

            preencherFormandos(
                $("#" + prefixo + "-formando"),
                codCampo,
                $(this).val(),
                formandoSelecionado
            );
        });
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

        registrarEventosDoFormulario("novo");
        registrarEventosDoFormulario("edit");

        $("#tbodyMatriculas").on("click", "[data-acao]", function () {
            const $botaoAcao = $(this);
            const codigoMatricula = $botaoAcao.data("codigo");
            const tipoAcao = $botaoAcao.data("acao");

            if (tipoAcao === "editar") abrirFormularioEdicao(codigoMatricula);
            if (tipoAcao === "remover") abrirConfirmacaoRemocao(codigoMatricula);
        });

        // gravar nova matrícula
        $("#formNovo").on("submit", function (evento) {
            evento.preventDefault();

            const dadosMatricula = obterDadosDoFormulario("novo");
            const erroValidacao = validarMatricula(dadosMatricula);

            if (erroValidacao) {
                mostrarMensagem("danger", erroValidacao);
                return;
            }

            listaMatriculas.push({
                codigo: gerarProximoCodigo(),
                codFormando: dadosMatricula.codFormando,
                formando: dadosMatricula.formando,
                idQualiNivel: dadosMatricula.idQualiNivel,
                qualificacao: dadosMatricula.qualificacao,
                nivel: dadosMatricula.nivel,
                codQualificacao: dadosMatricula.codQualificacao,
                codCampo: dadosMatricula.codCampo,
                campo: dadosMatricula.campo,
                codTurma: dadosMatricula.codTurma,
                turma: dadosMatricula.turma,
                data: dadosMatricula.data
            });

            renderizarTabela();
            $("#modalNovo").modal("hide");
            mostrarMensagem("success", "Matrícula registada com sucesso!");
        });

        // gravar edição
        $("#formEditar").on("submit", function (evento) {
            evento.preventDefault();

            const matriculaEmEdicao = encontrarMatricula($("#edit-codigo").val());
            if (!matriculaEmEdicao) return;

            const dadosMatricula = obterDadosDoFormulario("edit");
            const erroValidacao = validarMatricula(dadosMatricula);

            if (erroValidacao) {
                mostrarMensagem("danger", erroValidacao);
                return;
            }

            matriculaEmEdicao.codFormando = dadosMatricula.codFormando;
            matriculaEmEdicao.formando = dadosMatricula.formando;
            matriculaEmEdicao.idQualiNivel = dadosMatricula.idQualiNivel;
            matriculaEmEdicao.qualificacao = dadosMatricula.qualificacao;
            matriculaEmEdicao.nivel = dadosMatricula.nivel;
            matriculaEmEdicao.codQualificacao = dadosMatricula.codQualificacao;
            matriculaEmEdicao.codCampo = dadosMatricula.codCampo;
            matriculaEmEdicao.campo = dadosMatricula.campo;
            matriculaEmEdicao.codTurma = dadosMatricula.codTurma;
            matriculaEmEdicao.turma = dadosMatricula.turma;
            matriculaEmEdicao.data = dadosMatricula.data;

            renderizarTabela();
            $("#modalEditar").modal("hide");
            mostrarMensagem("success", "Matrícula atualizada com sucesso!");
        });

        // confirmar remoção
        $("#formDeletar").on("submit", function (evento) {
            evento.preventDefault();

            const codigoRemover = Number($("#del-codigo").val());

            listaMatriculas = listaMatriculas.filter(function (matricula) {
                return matricula.codigo !== codigoRemover;
            });

            renderizarTabela();
            $("#modalDeletar").modal("hide");
            mostrarMensagem("success", "Matrícula removida com sucesso!");
        });
    }

    // ---------------------------------------------------------------- arranque

    preencherCampo($("#novo-campo"), "");
    preencherQualificacoes($("#novo-qualiNivel"), "", "");
    preencherTurmas($("#novo-turma"), "", "", "");
    preencherFormandos($("#novo-formando"), "", "", "");

    preencherCampo($("#edit-campo"), "");
    preencherQualificacoes($("#edit-qualiNivel"), "", "");
    preencherTurmas($("#edit-turma"), "", "", "");
    preencherFormandos($("#edit-formando"), "", "", "");

    registrarEventos();
    renderizarTabela();
})();
