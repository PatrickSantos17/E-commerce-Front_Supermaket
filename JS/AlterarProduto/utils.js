function mostrarLoading() {
    document.getElementById("loadingModal").style.display = "block";
    document.querySelector(".container").classList.add('blur');
}

function esconderLoading() {
    document.getElementById("loadingModal").style.display = "none";
}

document.querySelector(".accept-cookie-button").addEventListener("click", directToListagemProdutos);