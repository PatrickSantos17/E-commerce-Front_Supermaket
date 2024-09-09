// var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

document.addEventListener('DOMContentLoaded', function () {
    // Aplicar máscara ao campo de CPF usando VanillaMasker
    VMasker(document.querySelector("#cpf")).maskPattern("999.999.999-99");
    const urlParams = new URLSearchParams(window.location.search);
    const usuarioId = urlParams.get('id');
    if (usuarioId) {

        const usuarioLogadoId = localStorage.getItem("id"); // Recupere o ID do usuário logado do localStorage

        // Verifique se o usuário logado está tentando alterar seu próprio perfil
        if (usuarioId === usuarioLogadoId) {
            alert("Você não pode alterar seu próprio perfil.");
            window.location.href = "TelaListagemUsuarios.html";
            return;
        }
        else {

            acessarUsuário(usuarioId);
        }
    }

    function acessarUsuário(usuarioId) {
        fetch('http://' + API + ':8080/usuario/consultar/' + usuarioId)
            .then(response => response.json())
            .then(usuario => {
                document.getElementById('nomeCompleto').value = usuario.nome;
                document.querySelector('#cpf').value = usuario.cpf;
                // Aplicar máscara ao campo de CPF usando VanillaMasker
                VMasker(document.querySelector("#cpf")).maskPattern("999.999.999-99");
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
                cpf: form.querySelector("#cpf").value.replace(/\D/g, ''),
                email: form.querySelector("#email").value,
                senha: form.querySelector('#senha').value || "", // Permite senha vazia
                grupo: form.querySelector('#grupo').value
            };

            if (typeof usuarioId !== 'undefined') {
                // Abre o modal de confirmação
                $('#alterarUsuarioModal').modal('show');

                // Adiciona evento ao botão de confirmação do modal
                document.getElementById('confirmAlterarUsuario').addEventListener('click', function () {
                    usuario.cpf = form.querySelector("#cpf").value.replace(/\D/g, '');
                    alterarUsuario(usuarioId, usuario);
                });

                // Adiciona evento ao botão de cancelamento do modal
                document.querySelector('#alterarUsuarioModal .btn-secondary').addEventListener('click', function () {
                    $('#alterarUsuarioModal').modal('hide');
                });
            } else {
                console.error("ID do usuário não está definido.");
            }
        } else {
            form.classList.add('was-validated'); // Adiciona feedback de validação
        }
    });

    function alterarUsuario(usuarioId, usuario) {
        fetch('http://' + API + ':8080/usuario/alterar/' + usuarioId, {
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
                } else if (response.status === 400) {
                    alert("Número do registro de contribuinte individual brasileiro (CPF) inválido!")
                    document.querySelector(".main").classList.remove('blur');
                    const cpfField = document.getElementById("cpf");
                    cpfField.setCustomValidity("Este CPF é inválido. Por favor, digite um CPF válido.");
                    cpfField.classList.add("is-invalid"); // Marcar o campo como inválido visualmente
                    cpfField.nextElementSibling.textContent = "Este CPF é inválido. Por favor, digite um CPF válido.";
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
        var cpf = this.value.replace(/\D/g, '');

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
    // Adiciona evento ao botão de cancelamento para redirecionar para a página de listagem de usuários
    document.querySelector('.btn-secondary').addEventListener('click', function () {
        window.location.href = 'TelaListagemUsuarios.html';
    });
    document.getElementById("cpf").addEventListener("input", function () {
        // Limpar a mensagem de erro personalizada quando o usuário digitar no campo
        this.setCustomValidity("");
        this.classList.remove("is-invalid");
    });
});