/**
 * Página: Formadores (pages/formador/formador.js)
 * Carregada por src/js/utils/PageLoad.js depois do HTML entrar no #app.
 *
 * Sem backend: a lista começa vazia. Quando a API existir, preencher
 * `listaFormadores` com os registos devolvidos pelo servidor.
 */

(function () {
    "use strict";

    // ---------------------------------------------------------------- dados

    const CAMPOS = ["Informática", "Gestão", "Electrónica", "Contabilidade", "Saúde"];
    const GENEROS = ["Masculino", "Feminino", "Outro"];
    const ESTADOS_CIVIL = ["Solteiro(a)", "Casado(a)", "União estável", "Divorciado(a)", "Viúvo(a)"];

    let listaFormadores = [
        {
            codigo: 1, nome: "Carlos", apelido: "Silva", codCampo: 1, campo: "Informática",
            email: "carlos.silva@exemplo.pt", genero: "Masculino", estadoCivil: "Casado(a)",
            contacto: "912345678", valorHora: 3500, horasMes: 80, isDiretor: true, isCoordenador: false,
            turmas: [{ turma: "TI-2025-A", qualificacao: "Técnico de Informática", ano_letivo: "2025", turno: "Manhã" }],
            qualificacoes: [{ qualificacao: "Técnico de Informática", campo: "Informática", niveis: "Nível 4" }],
            modulos: [{ modulo: "Programação I", qualificacao: "Técnico de Informática", turmas: "TI-2025-A", carga_horaria: 60 }]
        },
        {
            codigo: 2, nome: "Maria", apelido: "Sousa", codCampo: 2, campo: "Gestão",
            email: "maria.sousa@exemplo.pt", genero: "Feminino", estadoCivil: "Solteiro(a)",
            contacto: "923456789", valorHora: 3000, horasMes: 60, isDiretor: false, isCoordenador: true,
            turmas: [], qualificacoes: [], modulos: []
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

    function formatarNumero(valor) {
        return String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function calcularSalario(formador) {
        return (Number(formador.valorHora) || 0) * (Number(formador.horasMes) || 0);
    }

    function encontrarFormador(codigo) {
        return listaFormadores.filter(function (formador) {
            return formador.codigo === Number(codigo);
        })[0];
    }

    function gerarProximoCodigo() {
        const maiorCodigo = listaFormadores.reduce(function (maior, formador) {
            return Math.max(maior, formador.codigo);
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

    // ---------------------------------------------------------------- tabela

    function filtrarFormadores() {
        const termoPesquisa = ($("#pesquisa").val() || "").trim().toLowerCase();

        if (!termoPesquisa) return listaFormadores;

        return listaFormadores.filter(function (formador) {
            const textoPesquisavel = [
                formador.nome,
                formador.apelido,
                formador.email,
                formador.genero,
                formador.estadoCivil,
                formador.contacto,
                formador.campo
            ].join(" ").toLowerCase();

            return textoPesquisavel.indexOf(termoPesquisa) !== -1;
        });
    }

    function renderizarTabela() {
        const $corpoTabela = $("#tbodyFormadores");
        const formadoresFiltrados = filtrarFormadores();

        if (!formadoresFiltrados.length) {
            $corpoTabela.html(
                '<tr><td colspan="12" class="text-center text-muted py-4">' +
                "Nenhum formador encontrado.</td></tr>"
            );
            return;
        }

        $corpoTabela.html(formadoresFiltrados.map(function (formador) {
            let etiquetasFuncao = "";
            if (formador.isDiretor) {
                etiquetasFuncao += '<span class="badge badge-info mr-1">Diretor</span>';
            }
            if (formador.isCoordenador) {
                etiquetasFuncao += '<span class="badge badge-secondary">Coordenador</span>';
            }

            return "" +
                "<tr>" +
                "<td><strong>#" + escaparHtml(formador.codigo) + "</strong></td>" +
                "<td>" + escaparHtml(formador.nome) +
                    (etiquetasFuncao ? '<div class="mt-1">' + etiquetasFuncao + "</div>" : "") +
                "</td>" +
                "<td>" + escaparHtml(formador.apelido) + "</td>" +
                "<td>" + escaparHtml(formador.campo) + "</td>" +
                "<td>" + escaparHtml(formador.email) + "</td>" +
                '<td class="d-none d-lg-table-cell">' + escaparHtml(formador.genero) + "</td>" +
                '<td class="d-none d-lg-table-cell">' + escaparHtml(formador.estadoCivil) + "</td>" +
                "<td>" + escaparHtml(formador.contacto) + "</td>" +
                '<td class="d-none d-xl-table-cell">' + formatarNumero(formador.valorHora) + "</td>" +
                '<td class="d-none d-xl-table-cell">' + formatarNumero(formador.horasMes) + "</td>" +
                "<td>" + formatarNumero(calcularSalario(formador)) + "</td>" +
                '<td class="text-right text-nowrap">' +
                    '<button type="button" class="btn btn-sm btn-outline-secondary px-1" ' +
                        'data-acao="detalhes" data-codigo="' + formador.codigo + '" ' +
                        'title="Ver detalhes" aria-label="Ver detalhes">' +
                        '<svg class="icon icon-sm"><use href="#i-ver"></use></svg></button> ' +
                    '<button type="button" class="btn btn-sm btn-outline-primary px-1" ' +
                        'data-acao="editar" data-codigo="' + formador.codigo + '" ' +
                        'title="Editar" aria-label="Editar">' +
                        '<svg class="icon icon-sm"><use href="#i-editar"></use></svg></button> ' +
                    '<button type="button" class="btn btn-sm btn-outline-danger px-1" ' +
                        'data-acao="remover" data-codigo="' + formador.codigo + '" ' +
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

        preencherSelecao($("#novo-campo"), CAMPOS, CAMPOS[0]);
        abrirModal("modalNovo");
    }

    function abrirFormularioEdicao(codigo) {
        const formador = encontrarFormador(codigo);
        if (!formador) return;

        $("#edit-codigo").val(formador.codigo);
        $("#edit-nome").val(formador.nome);
        $("#edit-apelido").val(formador.apelido);
        $("#edit-email").val(formador.email);
        $("#edit-contacto").val(formador.contacto);
        $("#edit-valorHora").val(formador.valorHora);
        $("#edit-horasMes").val(formador.horasMes);
        $("#edit-isDiretor").prop("checked", !!formador.isDiretor);
        $("#edit-isCoordenador").prop("checked", !!formador.isCoordenador);

        preencherSelecao($("#edit-campo"), CAMPOS, formador.campo);
        preencherSelecao($("#edit-genero"), GENEROS, formador.genero);
        preencherSelecao($("#edit-estadoCivil"), ESTADOS_CIVIL, formador.estadoCivil);

        abrirModal("modalEditar");
    }

    function abrirConfirmacaoRemocao(codigo) {
        const formador = encontrarFormador(codigo);
        if (!formador) return;

        $("#del-codigo").val(formador.codigo);
        $("#del-detalhes").html(
            '<p class="mb-1"><strong>Código:</strong> #' + escaparHtml(formador.codigo) + "</p>" +
            '<p class="mb-1"><strong>Nome:</strong> ' + escaparHtml(formador.nome) + " " + escaparHtml(formador.apelido) + "</p>" +
            '<p class="mb-1"><strong>Campo:</strong> ' + escaparHtml(formador.campo) + "</p>" +
            '<p class="mb-0"><strong>Contacto:</strong> ' + escaparHtml(formador.contacto) + "</p>"
        );

        abrirModal("modalDeletar");
    }

    function criarTabela(colunas, linhas, textoVazio) {
        if (!linhas.length) {
            return '<p class="text-muted small mb-0">' + escaparHtml(textoVazio) + "</p>";
        }

        const cabecalho = colunas.map(function (tituloColuna) {
            return "<th>" + escaparHtml(tituloColuna) + "</th>";
        }).join("");

        const corpo = linhas.map(function (valoresLinha) {
            const celulas = valoresLinha.map(function (valorCelula, indiceColuna) {
                const conteudo = indiceColuna === 0
                    ? "<strong>" + escaparHtml(valorCelula) + "</strong>"
                    : escaparHtml(valorCelula);

                return "<td>" + conteudo + "</td>";
            }).join("");

            return "<tr>" + celulas + "</tr>";
        }).join("");

        return '<div class="table-responsive"><table class="table table-sm table-bordered mb-0">' +
            '<thead class="thead-light"><tr>' + cabecalho + "</tr></thead>" +
            "<tbody>" + corpo + "</tbody></table></div>";
    }

    function abrirDetalhes(codigo) {
        const formador = encontrarFormador(codigo);
        if (!formador) return;

        $("#tituloDetalhes").text("Detalhes do Formador #" + formador.codigo);

        const funcoes = ["Formador"];
        if (formador.isDiretor) funcoes.push("Diretor de Turma");
        if (formador.isCoordenador) funcoes.push("Coordenador");

        const dadosPessoais = [
            ["Nome", formador.nome + " " + formador.apelido],
            ["Campo", formador.campo],
            ["E-mail", formador.email],
            ["Género", formador.genero],
            ["Estado civil", formador.estadoCivil],
            ["Contacto", formador.contacto],
            ["Valor/Hora", formatarNumero(formador.valorHora)],
            ["Horas/Mês", formatarNumero(formador.horasMes)],
            ["Salário", formatarNumero(calcularSalario(formador))],
            ["Funções", funcoes.join(", ")]
        ].map(function (parDados) {
            const rotulo = parDados[0];
            const valor = parDados[1];

            return '<div class="col-sm-6"><p class="mb-1"><strong>' + escaparHtml(rotulo) +
                ":</strong> " + escaparHtml(valor) + "</p></div>";
        }).join("");

        const turmas = (formador.turmas || []).map(function (turma) {
            return [turma.turma, turma.qualificacao, turma.ano_letivo, turma.turno];
        });

        const qualificacoes = (formador.qualificacoes || []).map(function (qualificacao) {
            return [qualificacao.qualificacao, qualificacao.campo, qualificacao.niveis];
        });

        const modulos = (formador.modulos || []).map(function (modulo) {
            return [modulo.modulo, modulo.qualificacao, modulo.turmas, modulo.carga_horaria + " h"];
        });

        $("#detalhesConteudo").html(
            '<h6 class="text-uppercase text-muted small font-weight-bold">Dados Pessoais</h6>' +
            '<div class="border rounded p-3 mb-4"><div class="row">' + dadosPessoais + "</div></div>" +

            '<h6 class="text-uppercase text-muted small font-weight-bold">Turmas que dirige</h6>' +
            '<div class="mb-4">' +
            criarTabela(["Turma", "Qualificação", "Ano letivo", "Turno"], turmas, "Não dirige nenhuma turma.") +
            "</div>" +

            '<h6 class="text-uppercase text-muted small font-weight-bold">Qualificações que coordena</h6>' +
            '<div class="mb-4">' +
            criarTabela(["Qualificação", "Campo", "Nível"], qualificacoes, "Não coordena nenhuma qualificação.") +
            "</div>" +

            '<h6 class="text-uppercase text-muted small font-weight-bold">Módulos que leciona</h6>' +
            criarTabela(["Módulo", "Qualificação", "Turmas", "Carga horária"], modulos, "Não leciona nenhum módulo.")
        );

        abrirModal("modalDetalhes");
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

        $("#tbodyFormadores").on("click", "[data-acao]", function () {
            const $botaoAcao = $(this);
            const codigoFormador = $botaoAcao.data("codigo");
            const tipoAcao = $botaoAcao.data("acao");

            if (tipoAcao === "editar") abrirFormularioEdicao(codigoFormador);
            if (tipoAcao === "remover") abrirConfirmacaoRemocao(codigoFormador);
            if (tipoAcao === "detalhes") abrirDetalhes(codigoFormador);
        });

        // gravar novo formador
        $("#formNovo").on("submit", function (evento) {
            evento.preventDefault();

            const campoSelecionado = $("#novo-campo").val();

            const novoFormador = {
                codigo: gerarProximoCodigo(),
                nome: $("#novo-nome").val().trim(),
                apelido: $("#novo-apelido").val().trim(),
                codCampo: CAMPOS.indexOf(campoSelecionado) + 1,
                campo: campoSelecionado,
                email: $("#novo-email").val().trim(),
                genero: $("#novo-genero").val(),
                estadoCivil: $("#novo-estadoCivil").val(),
                contacto: $("#novo-contacto").val(),
                valorHora: Number($("#novo-valorHora").val()),
                horasMes: Number($("#novo-horasMes").val()),
                isDiretor: $("#novo-isDiretor").prop("checked"),
                isCoordenador: $("#novo-isCoordenador").prop("checked"),
                turmas: [],
                qualificacoes: [],
                modulos: []
            };

            if (!novoFormador.nome || !novoFormador.apelido || !novoFormador.email) {
                mostrarMensagem("danger", "Nome, apelido e e-mail são obrigatórios.");
                return;
            }

            listaFormadores.push(novoFormador);
            renderizarTabela();
            $("#modalNovo").modal("hide");
            mostrarMensagem("success", "Formador cadastrado com sucesso!");
        });

        // gravar edição
        $("#formEditar").on("submit", function (evento) {
            evento.preventDefault();

            const formadorEmEdicao = encontrarFormador($("#edit-codigo").val());
            if (!formadorEmEdicao) return;

            const campoSelecionado = $("#edit-campo").val();

            formadorEmEdicao.nome = $("#edit-nome").val().trim();
            formadorEmEdicao.apelido = $("#edit-apelido").val().trim();
            formadorEmEdicao.email = $("#edit-email").val().trim();
            formadorEmEdicao.contacto = $("#edit-contacto").val();
            formadorEmEdicao.valorHora = Number($("#edit-valorHora").val());
            formadorEmEdicao.horasMes = Number($("#edit-horasMes").val());
            formadorEmEdicao.isDiretor = $("#edit-isDiretor").prop("checked");
            formadorEmEdicao.isCoordenador = $("#edit-isCoordenador").prop("checked");
            formadorEmEdicao.campo = campoSelecionado;
            formadorEmEdicao.codCampo = CAMPOS.indexOf(campoSelecionado) + 1;
            formadorEmEdicao.genero = $("#edit-genero").val();
            formadorEmEdicao.estadoCivil = $("#edit-estadoCivil").val();

            renderizarTabela();
            $("#modalEditar").modal("hide");
            mostrarMensagem("success", "Formador atualizado com sucesso!");
        });

        // confirmar remoção
        $("#formDeletar").on("submit", function (evento) {
            evento.preventDefault();

            const codigoRemover = Number($("#del-codigo").val());

            listaFormadores = listaFormadores.filter(function (formador) {
                return formador.codigo !== codigoRemover;
            });

            renderizarTabela();
            $("#modalDeletar").modal("hide");
            mostrarMensagem("success", "Formador removido com sucesso!");
        });
    }

    // ---------------------------------------------------------------- arranque

    preencherSelecao($("#novo-campo"), CAMPOS, "");
    preencherSelecao($("#novo-genero"), GENEROS, "");
    preencherSelecao($("#novo-estadoCivil"), ESTADOS_CIVIL, "");
    preencherSelecao($("#edit-campo"), CAMPOS, "");
    preencherSelecao($("#edit-genero"), GENEROS, "");
    preencherSelecao($("#edit-estadoCivil"), ESTADOS_CIVIL, "");

    registrarEventos();
    renderizarTabela();
})();
