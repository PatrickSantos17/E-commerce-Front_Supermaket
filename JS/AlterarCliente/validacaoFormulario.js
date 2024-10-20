(() => {
    'use strict'

    const forms = document.querySelectorAll('.form')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

document.getElementById("cpf").addEventListener("blur", function () {
    var cpf = this.value.replace(/\D/g, '');;

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

function validarSenha() {
    var senha = document.getElementById("senha").value;
    var confirmSenha = document.getElementById("confirmSenha").value;

    if (senha.length >= 5) {
        document.getElementById("senha").classList.remove("is-invalid");
        document.getElementById("senha").classList.remove(".invalid-feedback");
        document.querySelector("#senha + .invalid-feedback").textContent = "";
    }

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


