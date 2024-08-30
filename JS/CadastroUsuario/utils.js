function mostrarLoading() {
    document.getElementById("loadingModal").style.display = "block";
    document.querySelector(".main").classList.add('blur');
}

function redirecionarParaPagina() {
    window.location.href = "TelaListagemUsuarios.html";

    window.history.replaceState(null, null, "TelaListagemUsuarios.html");
}

document.querySelector(".accept-cookie-button").addEventListener("click", redirecionarParaPagina);

function esconderLoading() {
    document.getElementById("loadingModal").style.display = "none";
}

function removerInvalidFeedbackClass() {
    const campos = document.querySelectorAll('.form-control');
    campos.forEach(campo => {
        campo.classList.remove("invalid-feedback");
    });
}

// Remove temporariamente as classes de validação dos campos
function removerValidacaoCampos() {
    const campos = document.querySelectorAll('.form-control');
    campos.forEach(campo => {
        campo.classList.remove('is-invalid');
        campo.classList.remove('is-valid');
    });
}

//Método para limpar os campos do front
function limparCampos() {
    document.querySelector("form").reset();
}


