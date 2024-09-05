// var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

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

    fetch('http://' + API + ':8080/login/entrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login)
    })
        .then(response => {
            if (response.status === 200) {

                // Login realizado com sucesso
                loginSucedido();
            } else if (response.status === 403) {
                // alert("Usuário/senha inválido!");
                loginInvalido()
            }
        })
        .catch(error => {
            // Exibe mensagem de erro em caso de falha na requisição
            console.log('Erro ao acessar usuário:', error);
            alert("Erro ao acessar usuário. Por favor, tente novamente.");
        });
}

function validarCampos() {
    let camposValidados = true;
    const emailValue = email.value;
    const senhaValue = senha.value;

    // Verifica se o campo de e-mail está vazio
    if (emailValue.trim() === '') {
        alert("Por favor, preencha o campo de e-mail.");
        email.focus();
        camposValidados = false;
    }

    // Verifica se o campo de senha está vazio
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

    // Função para abrir o modal
    const openModal = () => {
        modal.style.display = 'flex';
    };

    // abre o modal após o login bem sucedido
    openModal()

    // Direciona para a tela inicial
    btnTelaInicial.addEventListener('click', function (event) {
        event.preventDefault(); // Evita o comportamento padrão do formulário
        window.location.href = "TelaInicial.html";
    });
}

function loginInvalido() {
    const modal = document.querySelector('#not-valid');
    const btnOk = document.querySelector('#clicked');

    // Função para abrir o modal
    const openModal = () => {
        modal.style.display = 'flex';
    };

    // Função para fechar o modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Abre o modal
    openModal();

    // Adiciona o evento de clique ao botão 'btnOk'
    if (btnOk) {
        btnOk.addEventListener('click', (event) => {
            console.log("Botão OK clicado");
            closeModal();
        });
    } else {
        console.error("Elemento '.inicial' não encontrado.");
    }

    // Adiciona evento para fechar o modal ao clicar fora dele
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