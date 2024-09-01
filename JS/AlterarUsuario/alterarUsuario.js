var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
// var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('id');
    if (usuarioId) {
        acessarUsuário(usuarioId);
        console.log(usuarioId);
    }

    function acessarUsuário(usuarioId) {
        fetch('http://'+API+':8080/usuario/consultar/' + usuarioId)
            .then(response => response.json())
            .then(usuario => {
                document.getElementById('nomeCompleto').value = usuario.nome;
                document.getElementById('cpf').value = usuario.cpf;
                document.getElementById('email').value = usuario.credencialId.email;
                document.getElementById('grupo').value = usuario.grupo;
            })
            .catch(error => {
                console.error('Erro ao acessar usuário:', error);
                alert("Erro ao acessar usuário. Por favor, tente novamente.");
            });
    }

    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita o envio padrão do formulário

        const form = event.target;

        // Verifica se o formulário é válido e se a senha é válida (se a senha for fornecida)
        if (form.checkValidity() && validarSenha()) {
            const usuario = {
                nome: form.querySelector("#nomeCompleto").value,
                cpf: form.querySelector("#cpf").value,
                email: form.querySelector("#email").value,
                senha: form.querySelector('#senha').value || "", // Permite senha vazia
                grupo: form.querySelector('#grupo').value
            };

            if (typeof usuarioId !== 'undefined') {
                alterarUsuario(usuarioId, usuario);
            } else {
                console.error("ID do usuário não está definido.");
            }

            limparCampos(); // Limpa os campos após o envio
        } else {
            form.classList.add('was-validated'); // Adiciona feedback de validação
        }
    });

    function alterarUsuario(usuarioId, usuario) {
        fetch('http://'+API+':8080/usuario/alterar/' + usuarioId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        })
        .then(response => {
            if (response.status === 200) {
                alert("Usuário alterado com sucesso.");
                window.location.href = "TelaListagemUsuarios.html";
            } else {
                alert("Erro ao alterar usuário. Por favor, tente novamente.");
            }
        })
        .catch(error => {
            console.error('Erro ao alterar usuário:', error);
            alert("Erro ao alterar usuário. Por favor, tente novamente.");
        });
    }

    function validarSenha() {
        var senha = document.getElementById("senha").value;
        var confirmSenha = document.getElementById("confirmSenha").value;

        // Permite senha vazia
        if (senha === "" && confirmSenha === "") {
            return true;
        }

        // Verifica o comprimento mínimo da senha
        if (senha.length >= 5) {
            document.getElementById("senha").classList.remove("is-invalid");
            document.querySelector("#senha + .invalid-feedback").textContent = "";
        } else {
            document.getElementById("senha").classList.add("is-invalid");
            document.querySelector("#senha + .invalid-feedback").textContent = "A senha deve ter pelo menos 5 caracteres.";
            return false;
        }

        // Verifica se as senhas coincidem
        if (senha.length >= 5 && senha === confirmSenha) {
            document.getElementById("confirmSenha").classList.remove("is-invalid");
            document.querySelector("#confirmSenha + .invalid-feedback").textContent = "";
            return true;
        } else {
            document.getElementById("senha").classList.add("is-invalid");
            document.getElementById("confirmSenha").classList.add("is-invalid");
            document.querySelector("#confirmSenha + .invalid-feedback").textContent = "As senhas devem ter pelo menos 5 caracteres e serem iguais.";
            return false;
        }
    }

    document.getElementById("senha").addEventListener("input", validarSenha);
    document.getElementById("confirmSenha").addEventListener("input", validarSenha);

    // Validação de CPF
    document.getElementById("cpf").addEventListener("blur", function () {
        var cpf = this.value;

        if (!cpf.match(/^\d{11}$/)) {
            this.classList.add("is-invalid");
            this.nextElementSibling.textContent = "Digite um CPF válido contendo exatamente 11 dígitos.";
        } else {
            this.classList.remove("is-invalid");
            this.nextElementSibling.textContent = "";
        }
    });

    document.getElementById("cpf").addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, '');

        if (this.value.length > 11) {
            this.value = this.value.slice(0, 11);
        }
    });
});
