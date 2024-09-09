// var API = "4.228.231.177"; // Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; // Setar essa variavel quando testar local e comentar a do IP

var grupoUsuarioLogado = localStorage.getItem("grupo");

document.addEventListener("DOMContentLoaded", function () {

    if (grupoUsuarioLogado === "Admin") {
        // Aplicar máscara ao campo de CPF usando VanillaMasker
        VMasker(document.querySelector("#cpf")).maskPattern("999.999.999-99");

        document.querySelector(".btn-cancelar").addEventListener("click", function () {
            redirecionarParaListagem();
        });

        document.querySelector("form").addEventListener("submit", function (event) {
            event.preventDefault();

            const form = document.querySelector("form");
            if (form.checkValidity() && validarSenha() === true) {
                const usuario = {
                    nome: form.querySelector("#nomeCompleto").value,
                    cpf: form.querySelector("#cpf").value.replace(/\D/g, ''),  // Remover máscara antes de enviar
                    email: form.querySelector("#email").value,
                    senha: form.querySelector('#senha').value,
                    grupo: form.querySelector('#grupo').value
                };

                cadastrar(usuario);
            } else {
                form.classList.add('was-validated');
            }
        });
    } else {
        alert("Você não tem permissão para acessar esta página! Contate um administrador para ser cadastrado!");
        window.location.href = 'TelaLogin.html'
    }
});

function cadastrar(usuario) {
    mostrarLoading();
    fetch('http://' + API + ':8080/usuario/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
        .then(response => {
            if (response.status === 201) {
                setTimeout(() => {
                    esconderLoading();
                    document.querySelector(".card").style.display = "flex";
                }, 3000);
            } else if (response.status === 409) {
                alert("Este e-mail já foi cadastrado por outro usuário.");
                document.querySelector(".main").classList.remove('blur');
                esconderLoading();
                const emailField = document.getElementById("email");
                emailField.setCustomValidity("Este e-mail já está em uso. Por favor, escolha outro.");
                emailField.classList.add("is-invalid"); // Marcar o campo como inválido visualmente
                emailField.nextElementSibling.textContent = "Este e-mail já está em uso. Por favor, escolha outro.";
            } else if (response.status === 400) {
                alert("Número do registro de contribuinte individual brasileiro (CPF) inválido!")
                document.querySelector(".main").classList.remove('blur');
                esconderLoading();
                const cpfField = document.getElementById("cpf");
                cpfField.setCustomValidity("Este CPF é inválido. Por favor, digite um CPF válido.");
                cpfField.classList.add("is-invalid"); // Marcar o campo como inválido visualmente
                cpfField.nextElementSibling.textContent = "Este CPF é inválido. Por favor, digite um CPF válido.";

            }
        })
        .catch(error => {
            console.error('Erro ao cadastrar usuário:', error);
            alert("Erro ao cadastrar usuário. Por favor, tente novamente.");
            esconderLoading();
            document.querySelector(".main").classList.remove('blur');
            document.querySelector("footer").classList.remove('blur');
        });
}

document.getElementById("email").addEventListener("input", function () {
    // Limpar a mensagem de erro personalizada quando o usuário digitar no campo
    this.setCustomValidity("");
    this.classList.remove("is-invalid");
});
document.getElementById("cpf").addEventListener("input", function () {
    // Limpar a mensagem de erro personalizada quando o usuário digitar no campo
    this.setCustomValidity("");
    this.classList.remove("is-invalid");
});