function redirecionarParaTelaProduto() {
    window.location.href = "TelaProduto.html";

    window.history.replaceState(null, null, "TelaProduto.html");
}

function directToTelaPagamento() {
    window.location.href = "TelaPagamento.html";
}

// Aplicar blur e mostrar modal de pagamento-------------------------------------
function mostrarProcessamentoPagamento() {
    document.querySelector("main").classList.add('blur');
    // Exibe o modal de pagamento
    let processingModal = document.getElementById("container-modal");
    processingModal.style.display = "flex";
    // aplicando animação do modal
    setTimeout(function () {
        processingModal.classList.add("animate-modal");
        // atraso de 2 segundos, após animação do modal redireciona para a pagina
    }, 2000); // Atraso de 3 segundos (2000 milissegundos) para mostrar o modal em sua forma original
}

function esconderLoading() {
    document.querySelector("main").classList.remove('blur');
    let processingModal = document.getElementById("container-modal");
    processingModal.style.display = "none";
}