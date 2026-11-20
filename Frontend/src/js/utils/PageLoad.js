

function carregarPagina(nome){
    const base = `pages/${nome}/${nome}`
    const NotFound = `pages/NotFound/NotFound.html`
    $('#app').load(`${base}.html`, function(resposta,status){
        if(status === 'error'){
            $('#app').load(NotFound)
            return
        }
    })

    carregarScript("script-pagina", base)
}
function carregarScript(id, src){
    $(`#${id}`).remove()
    const script = $('<script>')
    script.attr("id", id)
    script.attr("src", `${src}.js`)
    $('body').append(script)
}

export default carregarPagina
