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

// Função de logout
logoutButton.addEventListener('click', function () {
    // localStorage.removeItem('nome');   // Remove o nome do usuário
    // localStorage.removeItem('grupo');  // Remove o grupo (Admin ou cliente)
    localStorage.clear();
    window.location.href = "TelaProduto.html";  // Redireciona para a tela de login
});

document.querySelector('.dados').addEventListener('click', function (event) {
    event.preventDefault(); 
    let autenticado = localStorage.getItem("autenticado");
    const isAutenticado = (autenticado.toLowerCase() === "true")
    if (isAutenticado === true) {
        window.location.href = 'TelaAlterarCliente.html?userId=' + localStorage.getItem("id");
    }
});
