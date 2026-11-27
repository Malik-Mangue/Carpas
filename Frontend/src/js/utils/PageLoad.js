/**
 * PageLoad.js — carrega uma página para dentro de um contentor (#app).
 *
 * Convenção:
 *   pages/<nome>/<nome>.html   → marcação da página
 *   pages/<nome>/<nome>.js     → script da página (opcional)
 *
 * Uso:
 *   import carregarPagina from './js/utils/PageLoad.js';
 *   carregarPagina('dasboard');
 */

const ID_SCRIPT_PAGINA = "script-pagina";

function carregarScriptDaPagina(idScript, caminhoBase) {
    $(`#${idScript}`).remove();

    const script = $("<script>");
    script.attr("id", idScript);
    script.attr("src", `${caminhoBase}.js`);
    $("body").append(script);
}

function carregarPagina(nomePagina, seletorDestino = "#app") {
    const caminhoBase = `pages/${nomePagina}/${nomePagina}`;

    $(seletorDestino).load(`${caminhoBase}.html`, function (_resposta, estado) {
        if (estado === "error") {
            $(seletorDestino).html(
                `<div class="alert alert-warning m-4" role="alert">` +
                `Página <strong>${nomePagina}</strong> não encontrada.</div>`
            );
            return;
        }

        carregarScriptDaPagina(ID_SCRIPT_PAGINA, caminhoBase);
    });
}

export default carregarPagina;
export { carregarScriptDaPagina };
