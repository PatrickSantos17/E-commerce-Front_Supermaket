let grupo = localStorage.getItem("grupo");
let nome = localStorage.getItem("nome");

let iconUsuario = document.getElementById('iconUsuario');
let nomeUsuario = document.querySelector('.nome-usuario');
let logoutButton = document.getElementById('logout'); // Botão de logout (escondido inicialmente)

// Verifica se o nome do usuário está definido no localStorage
if (nome) {
    // Usuário está logado, exibe as informações
    let palavras = nome.split(" ");
    let primeiroNome = palavras[0];

    // Exibe o nome do usuário e altera o ícone conforme o grupo
    if (grupo === "Admin") {
        iconUsuario.src = "src/img/profile-user-admin.png";
    } else {
        iconUsuario.src = "src/img/icon-cliente.png";
    }

    nomeUsuario.innerHTML = "Olá, " + primeiroNome;

    logoutButton.style.display = "block";
} else {
    logoutButton.style.display = "none";
}

// Função de logout
logoutButton.addEventListener('click', function () {
    localStorage.removeItem('nome');   // Remove o nome do usuário
    localStorage.removeItem('grupo');  // Remove o grupo (Admin ou cliente)
    window.location.href = "TelaProduto.html";  // Redireciona para a tela de login
});
