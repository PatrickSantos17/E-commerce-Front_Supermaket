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

    confirmarCadastroBtn.addEventListener('click', function() {
        const usuario = gerarJSON();
        console.log('JSON gerado:', JSON.stringify(usuario, null, 2)); // Adiciona log para depuração
        // enviarDados(usuario);
    });

    // Função para mostrar/ocultar campos de novo endereço
    function toggleNovoEndereco() {
        if (!mesmoEnderecoCheckbox.checked) {
            novosEnderecosContainer.style.display = 'block';
        } else {
            novosEnderecosContainer.style.display = 'block';
            // Limpar os endereços adicionados
            novosEnderecosContainer.innerHTML = '';
        }
    }

    // Evento de mudança do checkbox
    mesmoEnderecoCheckbox.addEventListener('change', toggleNovoEndereco);

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
                    <input type="text" class="form-control" required>
                    <div class="invalid-feedback">
                        Informe o n°.
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="complemento">Complemento</label>
                    <input type="text" class="form-control">
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

        const novoCepInput = novosEnderecosContainer.querySelector('.cep:last-of-type');
        const inputs = {
            bairro: novosEnderecosContainer.querySelector('.endereco:last-of-type .bairro'),
            logradouro: novosEnderecosContainer.querySelector('.endereco:last-of-type .logradouro'),
            cidade: novosEnderecosContainer.querySelector('.endereco:last-of-type .cidade'),
            uf: novosEnderecosContainer.querySelector('.endereco:last-of-type .uf')
        };

        novoCepInput.addEventListener('input', aplicarMascaraCEP);
        novoCepInput.addEventListener('blur', function () {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                buscarEnderecoViaCEP(cep, inputs);
            }
        });

        // Adicionar lógica para permitir apenas um checkbox marcado
        const novoCheckbox = novosEnderecosContainer.querySelector('.enderecopadrao:last-of-type');
        novoCheckbox.addEventListener('click', function () {
            document.querySelectorAll('.enderecopadrao').forEach(checkbox => {
                if (checkbox !== this) {
                    checkbox.checked = false;
                }
            });
        });
    });

    // Inicializar a exibição dos novos endereços com base no estado do checkbox
    toggleNovoEndereco();

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
    const dtNascimento = document.getElementById('dtNascimento').value;


    const enderecos = [];
    document.querySelectorAll('.endereco').forEach(endereco => {
        const cepField = endereco.querySelector('#cep');
        const logradouroField = endereco.querySelector('#logradouro');
        const complementoField = endereco.querySelector('#complemento');
        const bairroField = endereco.querySelector('#bairro');
        const numeroField = endereco.querySelector('#numero');
        const cidadeField = endereco.querySelector('#cidade');
        const ufField = endereco.querySelector('#uf');
        
        // Verificando se os campos existem antes de acessar seus valores
        const cep = cepField ? cepField.value : null;
        const logradouro = logradouroField ? logradouroField.value : null;
        const complemento = complementoField ? complementoField.value : null;
        const bairro = bairroField ? bairroField.value : null;
        const numero = numeroField ? numeroField.value : null;
        const cidade = cidadeField ? cidadeField.value : null;
        const uf = ufField ? ufField.value : null;
        // const entrega = endereco.querySelector('.mesmoEndereco').checked; // Checkbox de entrega
        // const cobranca = endereco.querySelector('.enderecopadrao').checked; // Checkbox de cobrança

        enderecos.push({
            cep,
            logradouro,
            complemento,
            bairro,
            numero,
            cidade,
            uf
            // entrega,
            // cobranca
        });
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
    const dtNascimento = document.getElementById('dtNascimento').value;
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
        const response = await fetch('http://localhost:8080/cliente/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar dados: ' + response.statusText);
        }

        const result = await response.json();
        console.log('Dados enviados com sucesso:', result);
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
    }
}
