let grupo = localStorage.getItem("grupo");
let nome = localStorage.getItem("nome");

//pega o primeiro nome do usuario
let palavras = nome.split(" ");
let primeiroNome = palavras[0];

let iconUsuario = document.getElementById('iconUsuario');
let nomeUsuario = document.querySelector('.nome-usuario');
let grupoUsuario = document.querySelector('.grupo-usuario');
let listagemUsuarios = document.getElementById('listagemUsuarios');

if (grupo === "Admin") {
    iconUsuario.src = "src/img/profile-user-admin.png"
    listagemUsuarios.style.display = "flex";
} else {
    iconUsuario.src = "src/img/profile-user.png"
}

nomeUsuario.innerHTML = "Olá, " + primeiroNome;
grupoUsuario.innerHTML = "" + grupo;





