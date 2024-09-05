// var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;
    if (form.checkValidity() && validarSenha() === true) {
        const usuario = {
            nome: form.querySelector("#nomeCompleto").value,
            cpf: form.querySelector("#cpf").value,
            email: form.querySelector("#email").value,
            senha: form.querySelector('#senha').value,
            grupo: form.querySelector('#grupo').value
        };

        cadastrar(usuario);
        document.getElementById("form").addEventListener("click", function () {
            removerInvalidFeedbackClass();
        });
        limparCampos();
    }
});

function cadastrar(usuario) {
    mostrarLoading();
    fetch('http://'+API+':8080/usuario/cadastro', {
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
                alert("CPF/E-mail já cadastrado.");
                document.querySelector(".main").classList.remove('blur');
                document.querySelector("footer").classList.remove('blur');
                esconderLoading();
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
