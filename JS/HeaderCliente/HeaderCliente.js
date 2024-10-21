let nome = localStorage.getItem("nome");

let iconUsuario = document.getElementById('iconUsuario');
let nomeUsuario = document.querySelector('.nome-usuario');
let dropdown = document.querySelector('.dropdown-content');
let logoutButton = document.querySelector('.logout');
let qtdCarrinho = document.querySelector('.qtd-carrinho');

// Verifica se o nome do usuário está definido no localStorage
if (nome) {
    // Usuário está logado, exibe as informações
    let palavras = nome.split(" ");
    let primeiroNome = palavras[0];

    iconUsuario.src = "src/img/icon-cliente.png";

    nomeUsuario.innerHTML = "Olá, " + primeiroNome;
} else {
    dropdown.style.display = "none";
}

if (localStorage.getItem("produtos")) {
    let listaProdutos = JSON.parse(localStorage.getItem("produtos"));
    qtdCarrinho.innerHTML = listaProdutos.length;
}

logoutButton.addEventListener('click', function (event) {
    event.preventDefault();
});

document.querySelector('.dados').addEventListener('click', function (event) {
    event.preventDefault();
    let autenticado = localStorage.getItem("autenticado");
    const isAutenticado = (autenticado.toLowerCase() === "true")
    if (isAutenticado === true) {
        window.location.href = 'TelaAlterarCliente.html?userId=' + localStorage.getItem("id");
    }
});

function abrirModalConfirmacao() {
    document.querySelector('.card-confirmar').innerHTML = `
                    <div class="card-content">
                        <p class="card-heading"></p>
                        <p class="card-description">Deseja realmente sair?</p>
                    </div>
                    <div class="card-button-wrapper">
                        <button onclick="fecharModalConfirmacao()" class="card-button secondary">Cancelar</button>
                        <button class="card-button primary confirmar-saida">Sair</button>
                    </div>
                    <button onclick="fecharModalConfirmacao()" class="exit-button">
                        <svg height="20px" viewBox="0 0 384 512">
                            <path
                                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z">
                            </path>
                        </svg>
                    </button>
    
    `;
    document.getElementById("overlay").style.display = "flex";
    document.querySelector('main').classList.add("blur");
    document.querySelector("header").classList.add("blur");
    document.querySelector('.card-confirmar').style.display = 'flex'; // Garante que o modal apareça

    const modal = document.querySelector(".card-confirmar");
    const heading = document.querySelector(".card-heading");
    const btnConfirmar = modal.querySelector('.card-button.primary');

    document.querySelector('.confirmar-saida').addEventListener('click', function (event) {
        localStorage.removeItem("autenticado");
        localStorage.removeItem("id");
        localStorage.removeItem("nome");
        localStorage.removeItem("grupo");
        localStorage.removeItem("ativo");
        window.location.href = 'TelaProduto.html';
    });
    btnConfirmar.onclick = () => {
        fecharModalConfirmacao();
    }
}

function fecharModalConfirmacao() {
    document.querySelector(".card-confirmar").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.querySelector("main").classList.remove("blur");
    document.querySelector("header").classList.remove("blur");
}