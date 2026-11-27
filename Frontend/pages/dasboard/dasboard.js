// Script da página: pages/dasboard/dasboard.js
// Carregado por src/js/utils/PageLoad.js depois do HTML ser injetado no #app.

(function () {
    "use strict";

    const $elementoAtualizacao = $("#lastUpdate");
    if (!$elementoAtualizacao.length) return;

    $elementoAtualizacao.text(new Date().toLocaleString("pt-PT", {
        dateStyle: "short",
        timeStyle: "short"
    }));
})();
