// var userId = params.get('userId');
var userId = 14;

let enderecosCadastrados = [];
let novosEnderecos = [];

document.addEventListener('DOMContentLoaded', () => {
    buscarCliente(userId);
});

function buscarCliente(userId) {
    fetch(`http://${API}:8080/cliente/consultar/${userId}`)
        .then(response => response.json())
        .then(cliente => {
            document.getElementById('nomeCompleto').value = cliente.nome;
            document.getElementById('cpf').value = formatarCPF(cliente.cpf);
            document.getElementById('sexo').value = cliente.genero;
            document.getElementById('email').value = cliente.email;
            document.getElementById('dtNascimento').value = converterParaFormatoDate(cliente.dtNascimento);
            enderecosCadastrados = cliente.enderecos;
            renderizarEnderecos();
        })
        .catch(error => {
            console.error('Erro ao buscar informações do cliente:', error);
            alert("Erro ao buscar informações do cliente. Por favor, tente novamente.");
        });
}

function renderizarEnderecos() {
    const enderecoFaturamento = document.querySelector('.linha-faturamento');
    const enderecos = document.querySelector(".enderecos");
    const padraoEntrega = document.querySelector('.padrao-entrega');
    enderecos.innerHTML = '';

    const todosEnderecos = [...enderecosCadastrados, ...novosEnderecos];

    todosEnderecos.forEach((endereco) => {
        const enderecoCliente = document.createElement('div');
        enderecoCliente.classList.add('endereco');

        if (endereco.cobranca) {
            enderecoFaturamento.innerHTML = `
                        <div class="col-md-6 mb-3">
                            <div class="endereco-faturamento">
                                <h5>${endereco.cep}</h5>
                                <p>${endereco.logradouro}, ${endereco.numero}</p>
                                <p>${endereco.bairro}</p>
                                <p>${endereco.cidade} - ${endereco.uf}</p>
                            </div>
                        </div>
                    `
        }

        if (enderecosCadastrados.length > 1) {
            padraoEntrega.textContent = "Escolha um endereço padrão de entrega:";
            if (endereco.entrega) {
                enderecoCliente.innerHTML = `
                                    <input type="radio" id="${endereco.id}" name="enderecoPrincipal" value="${endereco.id}" checked>
                                    <label for="${endereco.id}">
                                        <h5>${endereco.cep}</h5>
                                        <p>${endereco.logradouro}, ${endereco.numero}</p>
                                        <p>${endereco.bairro}</p>
                                        <p>${endereco.cidade} - ${endereco.uf}</p>
                                    </label>
                    `
            } else {
                enderecoCliente.innerHTML = `
                                    <input type="radio" id="${endereco.id}" name="enderecoPrincipal" value="${endereco.id}">
                                    <label for="${endereco.id}">
                                        <h5>${endereco.cep}</h5>
                                        <p>${endereco.logradouro}, ${endereco.numero}</p>
                                        <p>${endereco.bairro}</p>
                                        <p>${endereco.cidade} - ${endereco.uf}</p>
                                    </label>
                    `
            }
        } else {
            padraoEntrega.textContent = "Endereço padrão de entrega:";
            enderecoCliente.innerHTML = `
                                    <label for="${endereco.id}">
                                        <h5>${endereco.cep}</h5>
                                        <p>${endereco.logradouro}, ${endereco.numero}</p>
                                        <p>${endereco.bairro}</p>
                                        <p>${endereco.cidade} - ${endereco.uf}</p>
                                    </label>
                                    `
        }

        enderecos.appendChild(enderecoCliente);
    });

    const cepInput = document.querySelector('#cep');
    cepInput.addEventListener('input', aplicarMascaraCEP);

    document.getElementById('cep').addEventListener('blur', async function () {
        let cep = document.getElementById('cep').value;
        try {
            const endereco = await buscarEnderecoViaCEP(cep);
            console.log(endereco.erro);
            if (endereco.erro) {
                mostrarMensagemErro('CEP não encontrado.');
            } else {
                console.log('Endereço encontrado:', endereco);
                mostrarEndereco(endereco);
            }
        } catch (error) {
            mostrarMensagemErro('Erro ao buscar o CEP.');
            console.log(error);
            console.error('Erro:', error);
        }
    });
}

document.querySelector('#salvar-endereco').addEventListener('click', async function (event) {
    event.preventDefault();

    const form = document.querySelector(".modal-completo-ende");
    if (form.checkValidity()) {
        const endereco = {
            cep: document.getElementById('cep').value,
            logradouro: document.getElementById('logradouro').value,
            numero: document.getElementById('numero').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            uf: document.getElementById('uf').value,
            complemento: document.getElementById('complemento').value,
            cobranca: false,
            entrega: false
        };
        console.log(endereco);
        novosEnderecos.push(endereco);
        closeModalEndereco(event);
        renderizarEnderecos();
    } else {
        form.classList.add('was-validated');
    }
});

function closeModalEndereco(event) {
    event.preventDefault();
    const modalEndereco = document.querySelector('#cartao-endereco');
    modalEndereco.style.display = 'none';
    limparCamposModal();
};

function limparCamposModal() {
    const inputs = document.querySelectorAll('#cartao-endereco input'); // Seleciona todos os inputs dentro do modal
    inputs.forEach(input => {
        input.value = ""; // Limpa o valor de cada input
    });
}

function aplicarMascaraCEP(event) {
    let cep = event.target.value.replace(/\D/g, '');
    if (cep.length > 5) {
        cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
    }
    event.target.value = cep;
}

async function buscarEnderecoViaCEP(cep) {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    return response.json();
}

function mostrarMensagemErro(mensagem) {
    const feedback = document.querySelector('.cepInput .invalid-feedback');
    feedback.textContent = mensagem;
    feedback.style.display = 'block';
}

function mostrarEndereco(endereco) {
    const feedback = document.querySelector('.cepInput .invalid-feedback');
    feedback.style.display = 'none';
    document.getElementById('bairro').value = endereco.bairro;
    document.getElementById('cidade').value = endereco.localidade;
    document.getElementById('uf').value = endereco.uf;
    document.getElementById('logradouro').value = endereco.logradouro;
}

function converterParaFormatoDate(inputString) {
    return inputString.slice(0, 10);
}

function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function validarAno() {
    const dtNascimento = new Date(document.getElementById('dtNascimento').value).toISOString();
    const anoNascimento = new Date(dtNascimento).getFullYear();
    const anoAtual = new Date().getFullYear();

    if (anoNascimento > anoAtual) {
        alert('A data de nascimento não pode ser no futuro!');
        document.getElementById('dtNascimento').value = ''; // Limpa o campo se a data for inválida
    }
}