(() => {
    'use strict'

    const forms = document.querySelectorAll('.form')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('invalid-feedback')
        }, false)
    })
})()

// Função para aplicar a máscara de CEP (12345-678)
function aplicarMascaraCEP(event) {
    let cep = event.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    if (cep.length > 5) {
        cep = cep.replace(/(\d{5})(\d)/, '$1-$2'); // Aplica a máscara 12345-678
    }
    event.target.value = cep; // Atualiza o campo com a máscara
}

// Função para buscar o endereço usando a API ViaCEP
async function buscarEnderecoViaCEP(cep, inputs) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        // Verifica se o CEP é inválido
        if (data.erro) {
            console.error('CEP inválido.');
            return; // Sai da função se o CEP for inválido
        }

        // Preencher os campos com os dados da resposta da API
        inputs.bairro.value = data.bairro || '';
        inputs.logradouro.value = data.logradouro || '';
        inputs.cidade.value = data.localidade || ''; // "localidade" no ViaCEP
        inputs.uf.value = data.uf || '';
    } catch (error) {
        console.error('Erro ao consultar o CEP:', error);
    }
}

// Evento para o campo de CEP no formulário principal
document.getElementById('cep').addEventListener('input', aplicarMascaraCEP);
document.getElementById('cep').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        buscarEnderecoViaCEP(cep, {
            bairro: document.getElementById('bairro'),
            logradouro: document.getElementById('logradouro'),
            cidade: document.getElementById('cidade'),
            uf: document.getElementById('uf')
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const adicionarEnderecoBtn = document.getElementById('adicionarEndereco');
    const confirmarCadastroBtn = document.getElementById('confirmarCadastro');
    const novosEnderecosContainer = document.getElementById('novosEnderecos');
    const mesmoEnderecoCheckbox = document.getElementById('mesmoEndereco');

    confirmarCadastroBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Impede o envio do formulário
        const form = document.querySelector('.form');
        if (form.checkValidity()) {
            const usuario = gerarJSON();
            console.log('JSON gerado:', JSON.stringify(usuario, null, 2)); // Adiciona log para depuração
            enviarDados(usuario);
        } else {
            form.classList.add('was-validated');
        }
    });
    // Adicionar novo endereço
    adicionarEnderecoBtn.addEventListener('click', function () {
        novosEnderecosContainer.style.display = 'block';
        const novoEnderecoHTML = `
            <div class="row endereco">
                <div class="col-md-6 mb-3">
                    <label for="cep">CEP</label>
                    <input type="text" class="form-control cep" inputmode="numeric" required>
                    <div class="invalid-feedback">
                        Digite um CEP válido.
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="bairro">Bairro</label>
                    <input type="text" class="form-control bairro" disabled>
                    <div class="invalid-feedback">
                        Informe o bairro.
                    </div>
                </div>
                <div class="col-md-12 mb-3">
                    <label for="logradouro">Logradouro</label>
                    <input type="text" class="form-control logradouro" disabled>
                    <div class="invalid-feedback">
                        Informe um endereço válido.
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="numero">Número</label>
                    <input type="text" class="form-control numero" required>
                    <div class="invalid-feedback">
                        Informe o n°.
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="complemento">Complemento</label>
                    <input type="text" class="form-control complemento">
                </div>
                <div class="col-md-8 mb-3">
                    <label for="cidade">Cidade</label>
                    <input type="text" class="form-control cidade" disabled>
                    <div class="invalid-feedback">
                        Informe a cidade.
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <label for="uf">UF</label>
                    <input type="text" class="form-control uf" disabled style="width: 100%;">
                    <div class="invalid-feedback">
                        Informe a UF.
                    </div>
                </div>
                <div class="form-check mb-3">
                    <input type="checkbox" class="form-check-input enderecopadrao" id="enderecopadrao">
                    <label class="form-check-label" for="enderecopadrao">Endereço padrão</label>
                </div>
            </div>
        `;
        novosEnderecosContainer.insertAdjacentHTML('beforeend', novoEnderecoHTML);
        
        novosEnderecosContainer.addEventListener('input', function (event) {
    // Verifica se o alvo do input é um input de CEP
    if (event.target.classList.contains('cep')) {
        aplicarMascaraCEP(event); // Chama a função de máscara
    }
});


        novosEnderecosContainer.addEventListener('blur', function (event) {
            // Verifica se o alvo do blur é um input de CEP
            if (event.target.classList.contains('cep')) {
                const cep = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
                if (cep.length === 8) { // Se o CEP tem 8 dígitos
                    const inputs = {
                        bairro: event.target.closest('.endereco').querySelector('.bairro'),
                        logradouro: event.target.closest('.endereco').querySelector('.logradouro'),
                        cidade: event.target.closest('.endereco').querySelector('.cidade'),
                        uf: event.target.closest('.endereco').querySelector('.uf')
                    };
                    buscarEnderecoViaCEP(cep, inputs);
                } else {
                    console.warn('CEP inválido:', cep); // Log de CEP inválido para depuração
                }
            }
        }, true);

        const novoCheckbox = novosEnderecosContainer.querySelector('.enderecopadrao:last-of-type');

        novoCheckbox.addEventListener('click', function () {
            // Desmarcar outros checkboxes de endereço padrão
            document.querySelectorAll('.enderecopadrao').forEach(checkbox => {
                if (checkbox !== this) {
                    checkbox.checked = false; // Desmarcar outros
                }
            });
            // Desmarcar o checkbox de cobrança se um endereço padrão for selecionado
            if (this.checked) {
                mesmoEnderecoCheckbox.checked = false;
            }
        });
    });

    // Inicializar a exibição dos novos endereços com base no estado do checkbox

    // Evento para confirmar o cadastro
    confirmarCadastroBtn.addEventListener('click', function() {
        const usuario = gerarJSON();
        console.log(usuario);
        console.log('JSON gerado:', JSON.stringify(usuario, null, 2)); // Adiciona log para depuração
        // enviarDados(usuario);
    });
});

function gerarJSON() {
    const nome = document.getElementById('nomeCompleto').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const genero = document.getElementById('sexo').value;
    const cpf = document.getElementById('cpf').value;
    const dtNascimento = new Date(document.getElementById('dtNascimento').value).toISOString();


    const enderecos = [];
let cobrancaDefinida = false; // Variável para controlar se o endereço de cobrança já foi definido

document.querySelectorAll('.endereco').forEach(endereco => {
    const cepField = endereco.querySelector('.cep');
    const logradouroField = endereco.querySelector('.logradouro');
    const complementoField = endereco.querySelector('.complemento');
    const bairroField = endereco.querySelector('.bairro');
    const numeroField = endereco.querySelector('.numero');
    const cidadeField = endereco.querySelector('.cidade');
    const ufField = endereco.querySelector('.uf');

    const entregaCheckbox = endereco.querySelector('.enderecopadrao'); // Checkbox de entrega

    // Verifica se o campo de CEP está preenchido
    if (cepField) {
        const cep = cepField.value || null;
        const logradouro = logradouroField ? logradouroField.value : null;
        const complemento = complementoField ? complementoField.value : null;
        const bairro = bairroField ? bairroField.value : null;
        const numero = numeroField ? numeroField.value : null;
        const cidade = cidadeField ? cidadeField.value : null;
        const uf = ufField ? ufField.value : null;
        const entrega = entregaCheckbox ? entregaCheckbox.checked : false;

        // Se o endereço está completo, adicione ao array
        if (cep || logradouro || bairro || numero || cidade || uf) {
            // Define cobranca como true apenas para o primeiro endereço marcado como entrega
            const cobranca = !cobrancaDefinida && entrega ? true : false;
            if (cobranca) {
                cobrancaDefinida = true; // Define que o endereço de cobrança já foi definido
            }

            enderecos.push({
                cep,
                logradouro,
                complemento,
                bairro,
                numero,
                cidade,
                uf,
                entrega,
                cobranca
            });
        }
    }
});

// Verifica se há endereços
if (enderecos.length === 0) {
    console.error('Nenhum endereço foi adicionado.');
    // Adicione um endereço padrão ou trate conforme necessário
}

const usuario = {
    nome,
    email,
    senha,
    genero,
    cpf,
    dtNascimento,
    enderecos
};

console.log(JSON.stringify(usuario, null, 2));
return usuario;
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


// Função para enviar dados ao servidor
async function enviarDados(usuario) {
    try {
        console.log('Enviando dados:', JSON.stringify(usuario, null, 2)); // Log do JSON enviado

        const response = await fetch(`http://${API}:8080/cliente/cadastro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        if (!response.ok) {
            const errorText = await response.text(); // Obter a mensagem de erro detalhada do servidor
            console.error('Resposta do servidor:', errorText); // Log da resposta do servidor
            throw new Error('Erro ao enviar dados: ' + errorText);
        }

        const result = await response.json();
        console.log('Dados enviados com sucesso:', result);
        const modal = document.getElementById('modal-confirm');
        modal.style.display = 'block';

        // Fechar o modal quando o usuário clicar no botão de fechar
        const closeModal = modal.querySelector('.accept-cookie-button');
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        // Fechar o modal quando o usuário clicar fora do modal
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });


    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }
}