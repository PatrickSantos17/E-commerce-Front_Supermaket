const formulario = document.querySelector("form")
const email = document.querySelector(".email")
const senha = document.querySelector(".senha")
const btnLogin = document.querySelector(".btn-login");
const show = document.querySelector(".modal-confirm");


function validarLogin() {
    const login = {
        "email": email.value,
        "senha": senha.value
    };

    fetch('http://' + API + ':8080/loginCliente/entrarCliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    })
        .then(response => {
            if (response.status === 200) {

                return response.json();
            } else if (response.status === 403) {

                loginInvalido()
                console.log('Usuário ou senha inválido');
                return Promise.reject('Usuário ou senha inválido');
            }
        })
        .then(data => {

            console.log("Cliente autenticado: " + data.autenticado)
            localStorage.setItem("autenticadoCliente", data.autenticado);
            localStorage.setItem("clienteId", data.id);
            localStorage.setItem("nomeCliente", data.nome);

            loginSucedido();
        })
        .catch(error => {
            console.log('Erro ao acessar usuário:', error);
        });
}

function validarCampos() {
    let camposValidados = true;
    const emailValue = email.value;
    const senhaValue = senha.value;

    if (emailValue.trim() === '') {
        alert("Por favor, preencha o campo de e-mail.");
        email.focus();
        camposValidados = false;
    }

    if (senhaValue.trim() === '') {
        alert("Por favor, preencha o campo de senha.");
        senha.focus();
        camposValidados = false;
    }

    return camposValidados;
}

function loginSucedido() {
    const modal = document.querySelector('.cartao');
    const btnTelaInicial = document.querySelector('.inicial');

    modal.style.display = 'flex';

    btnTelaInicial.addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = "TelaProduto.html";
    });
}

function loginInvalido() {
    const modal = document.querySelector('#not-valid');
    const btnOk = document.querySelector('#clicked');

    const openModal = () => {
        modal.style.display = 'flex';
    };

    const closeModal = () => {
        modal.style.display = 'none';
    };

    openModal();

    if (btnOk) {
        btnOk.addEventListener('click', (event) => {
            closeModal();
        });
    } else {
        console.error("Elemento '#not-valid' não encontrado.");
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });
}

function limparCampos() {
    document.querySelector(".card-login").reset();
}

btnLogin.addEventListener('click', function (event) {
    event.preventDefault();
    if (validarCampos()) {
        validarLogin();
    }
});
