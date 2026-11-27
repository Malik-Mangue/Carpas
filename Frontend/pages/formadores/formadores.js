$(document).ready(function () {
  $('#sidebar').load('../../../componentes/sidebar.html');
  $('#header').load('../../../componentes/header.html');
  $('#footer').load('../../../componentes/footer.html');

  // =========================================================================
  // 1. CONFIGURAÇÃO DA API
  // Coloca aqui o URL base da tua API (ex: 'http://localhost:3000/api/formadores').
  // Enquanto estiver vazio (''), a página usa o array local de exemplo.
  // =========================================================================
  const API_URL = '';

  // Array principal que guarda os formadores em memória (preenchido pela API ou localmente)
  let formadores = [
    {
      id: 1,
      nome: 'Ana Silva',
      email: 'ana.silva@carpas.pt',
      telefone: '912345678',
      especialidade: 'Desenvolvimento Web',
      estado: 'Ativo'
    },
    {
      id: 2,
      nome: 'Carlos Mendes',
      email: 'carlos.mendes@carpas.pt',
      telefone: '934567890',
      especialidade: 'Bases de Dados',
      estado: 'Ativo'
    }
  ];

  let proximoId = 3;

  // =========================================================================
  // 2. ÁREA DE VALIDAÇÕES (EDITA AQUI AS TUAS REGRAS)
  // Cada função recebe o texto digitado no input.
  // - Devolve '' (string vazia) se estiver CORRETO (fica verde).
  // - Devolve uma mensagem de erro se estiver ERRADO (fica vermelho com a mensagem).
  // =========================================================================
  const regrasValidacao = {
    'formador-nome': function (valor) {
      const texto = valor.trim();
      if (texto.length < 3) {
        return 'O nome deve ter pelo menos 3 caracteres.';
      }
      return '';
    },

    'formador-email': function (valor) {
      const texto = valor.trim();
      const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!padraoEmail.test(texto)) {
        return 'Insere um email válido (ex: nome@dominio.pt).';
      }
      return '';
    },

    'formador-telefone': function (valor) {
      const digitos = valor.replace(/\s+/g, '');
      if (!/^\d{9,}$/.test(digitos)) {
        return 'O telefone deve ter pelo menos 9 dígitos numéricos.';
      }
      return '';
    },

    'formador-especialidade': function (valor) {
      const texto = valor.trim();
      if (texto.length < 2) {
        return 'Indica a especialidade do formador.';
      }
      return '';
    }
  };

  // Manipula o DOM do input: verde (.is-valid) ou vermelho (.is-invalid + mensagem)
  function validarCampo($input) {
    const idCampo = $input.attr('id');
    const regra = regrasValidacao[idCampo];
    if (!regra) return true;

    const mensagemErro = regra($input.val());
    const $feedback = $input.siblings('.invalid-feedback');

    if (mensagemErro) {
      $input.removeClass('is-valid').addClass('is-invalid');
      $feedback.text(mensagemErro);
      return false;
    }

    $input.removeClass('is-invalid').addClass('is-valid');
    $feedback.text('');
    return true;
  }

  // Valida todos os campos do formulário antes de enviar na requisição
  function validarFormulario() {
    let valido = true;
    $('#form-formador input[id]').each(function () {
      const $input = $(this);
      if (regrasValidacao[$input.attr('id')] && !validarCampo($input)) {
        valido = false;
      }
    });
    return valido;
  }

  function limparValidacoes() {
    $('#form-formador input').removeClass('is-valid is-invalid');
    $('#form-formador .invalid-feedback').text('');
  }

  // =========================================================================
  // 3. CONVERSÃO DE JSON E REQUISIÇÕES CRUD À API
  // =========================================================================

  // Converte a resposta da API (JSON string ou objeto/array) para array de objetos
  function converterParaArray(resposta) {
    const dados = typeof resposta === 'string' ? JSON.parse(resposta) : resposta;
    if (Array.isArray(dados)) return dados;
    if (dados && Array.isArray(dados.data)) return dados.data;
    return [];
  }

  // READ (GET): Carrega a lista de formadores da API para o array
  function carregarFormadores() {
    if (!API_URL) {
      renderizarTabela($('#pesquisa-formador').val());
      return;
    }

    // Coloca aqui cabeçalhos ou parâmetros extras se a tua API precisar (ex: Authorization)
    $.ajax({
      url: API_URL,
      method: 'GET',
      dataType: 'json',
      success: function (resposta) {
        formadores = converterParaArray(resposta);
        renderizarTabela($('#pesquisa-formador').val());
      },
      error: function (erro) {
        console.error('Erro ao carregar formadores da API:', erro);
      }
    });
  }

  // CREATE (POST) e UPDATE (PUT): Envia os dados do formulário para a API
  function guardarFormador(id, dados) {
    if (!API_URL) {
      if (id) {
        const indice = formadores.findIndex(function (f) {
          return f.id === Number(id);
        });
        if (indice !== -1) {
          formadores[indice] = $.extend({ id: Number(id) }, dados);
        }
      } else {
        formadores.push($.extend({ id: proximoId++ }, dados));
      }
      $('#modal-formador').modal('hide');
      renderizarTabela($('#pesquisa-formador').val());
      return;
    }

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? API_URL + '/' + id : API_URL;

    $.ajax({
      url: url,
      method: metodo,
      contentType: 'application/json',
      data: JSON.stringify(dados),
      success: function () {
        $('#modal-formador').modal('hide');
        carregarFormadores();
      },
      error: function (erro) {
        console.error('Erro ao guardar formador na API:', erro);
      }
    });
  }

  // DELETE: Remove um formador na API pelo id
  function removerFormador(id) {
    if (!API_URL) {
      formadores = formadores.filter(function (f) {
        return f.id !== id;
      });
      renderizarTabela($('#pesquisa-formador').val());
      return;
    }

    $.ajax({
      url: API_URL + '/' + id,
      method: 'DELETE',
      success: function () {
        carregarFormadores();
      },
      error: function (erro) {
        console.error('Erro ao remover formador na API:', erro);
      }
    });
  }

  // =========================================================================
  // 4. RENDERIZAÇÃO DA TABELA E EVENTOS DO DOM
  // =========================================================================
  function renderizarTabela(filtro) {
    const termo = (filtro || '').toLowerCase().trim();
    const $tbody = $('#tabela-formadores tbody');
    $tbody.empty();

    const lista = formadores.filter(function (f) {
      if (!termo) return true;
      return (
        f.nome.toLowerCase().indexOf(termo) !== -1 ||
        f.email.toLowerCase().indexOf(termo) !== -1 ||
        f.especialidade.toLowerCase().indexOf(termo) !== -1
      );
    });

    if (lista.length === 0) {
      $tbody.append(
        '<tr><td colspan="6" class="text-center text-muted py-4">Nenhum formador encontrado.</td></tr>'
      );
      return;
    }

    lista.forEach(function (f) {
      const badgeClass = f.estado === 'Ativo' ? 'badge-success' : 'badge-secondary';
      const $linha = $('<tr>');
      $linha.append($('<td>').text(f.nome));
      $linha.append($('<td>').text(f.email));
      $linha.append($('<td>').text(f.telefone));
      $linha.append($('<td>').text(f.especialidade));
      $linha.append(
        $('<td>').append($('<span>').addClass('badge ' + badgeClass).text(f.estado))
      );

      const $acoes = $('<td>').addClass('text-right');
      const $btnEditar = $('<button>')
        .attr('type', 'button')
        .addClass('btn btn-sm btn-outline-primary mr-1 btn-editar')
        .attr('data-id', f.id)
        .text('Editar');
      const $btnRemover = $('<button>')
        .attr('type', 'button')
        .addClass('btn btn-sm btn-outline-danger btn-remover')
        .attr('data-id', f.id)
        .text('Remover');

      $acoes.append($btnEditar, $btnRemover);
      $linha.append($acoes);
      $tbody.append($linha);
    });
  }

  function limparFormulario() {
    $('#formador-id').val('');
    $('#formador-nome').val('');
    $('#formador-email').val('');
    $('#formador-telefone').val('');
    $('#formador-especialidade').val('');
    $('#formador-estado').val('Ativo');
    limparValidacoes();
  }

  // Validação em tempo real ao digitar (evento "input")
  $('#form-formador').on('input', 'input', function () {
    validarCampo($(this));
  });

  $('#btn-novo-formador').on('click', function () {
    limparFormulario();
    $('#modal-formador-titulo').text('Novo Formador');
    $('#modal-formador').modal('show');
  });

  $('#form-formador').on('submit', function (e) {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const id = $('#formador-id').val();
    const dados = {
      nome: $('#formador-nome').val().trim(),
      email: $('#formador-email').val().trim(),
      telefone: $('#formador-telefone').val().trim(),
      especialidade: $('#formador-especialidade').val().trim(),
      estado: $('#formador-estado').val()
    };

    guardarFormador(id, dados);
  });

  $('#tabela-formadores').on('click', '.btn-editar', function () {
    const id = Number($(this).attr('data-id'));
    const formador = formadores.find(function (f) {
      return f.id === id;
    });
    if (!formador) return;

    limparValidacoes();
    $('#formador-id').val(formador.id);
    $('#formador-nome').val(formador.nome);
    $('#formador-email').val(formador.email);
    $('#formador-telefone').val(formador.telefone);
    $('#formador-especialidade').val(formador.especialidade);
    $('#formador-estado').val(formador.estado);
    $('#modal-formador-titulo').text('Editar Formador');
    $('#modal-formador').modal('show');
  });

  $('#tabela-formadores').on('click', '.btn-remover', function () {
    const id = Number($(this).attr('data-id'));
    removerFormador(id);
  });

  $('#pesquisa-formador').on('input', function () {
    renderizarTabela($(this).val());
  });

  // Arranque inicial: carrega da API (ou mostra os dados locais se API_URL estiver vazio)
  carregarFormadores();
});
