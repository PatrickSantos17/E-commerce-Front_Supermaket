let userId = localStorage.getItem("clienteId");

window.addEventListener('DOMContentLoaded', function () {
    buscarEnderecoPadrao(userId);
    buscarEnderecosCliente(userId);
    // const checkbox = document.getElementById('checkEndereco');
    // const entregaPadrao = document.querySelector(".entrega-selecionada");

    // if (checkbox) {
    //     checkbox.addEventListener('change', function () {
    //         console.log('Checkbox foi clicado! Novo estado:', this.checked);
    //         if (this.checked) {
    //             // Se o checkbox foi marcado, busca o endereço padrão
    //             if (userId) {
    //                 buscarEnderecoPadrao(userId);
    //             } else {
    //                 console.error("ID do cliente não encontrado no localStorage.");
    //             }
    //         } else {
    //             // Caso o checkbox seja desmarcado, limpa a área de entrega padrão
    //             entregaPadrao.innerHTML = '';
    //         }
    //     });
    // } else {
    //     console.error('Checkbox não encontrado no DOM!');
    // }
});

function buscarEnderecoPadrao(userId) {
    fetch(`http://${API}:8080/cliente/enderecoEntrega/${userId}`)
        .then(response => response.json())
        .then(endereco => {
            let enderecoAbreviado = `${endereco.logradouro}, ${endereco.numero} - CEP: ${endereco.cep}`;

            const checkbox = document.getElementById('checkEndereco');
            if (checkbox) {
                checkbox.value = endereco.id; // Supondo que `endereco.id` é o valor que deseja atribuir
            }
            // Atualiza o conteúdo da entrega-selecionada
            const entregaPadrao = document.querySelector(".entrega-padrao-selecionada");
            entregaPadrao.innerHTML = `
                <p class="entrega-padrao">${enderecoAbreviado}</p>
            `;
        })
        .catch(error => {
            console.error('Erro ao buscar endereço de entrega:', error);
            alert("Erro ao buscar endereço de entrega. Por favor, tente novamente.");
        });
}

function buscarEnderecosCliente(userId) {
    fetch(`http://${API}:8080/cliente/consultar/${userId}`)
        .then(response => response.json())
        .then(cliente => {

            const listaOutrosEnderecos = document.querySelector(".radio-input");
            cliente.enderecos.forEach(endereco => {

                if (endereco.entrega === false) {

                    let enderecoAbreviado = `${endereco.logradouro}, ${endereco.numero} - CEP: ${endereco.cep}`;

                    listaOutrosEnderecos.innerHTML += `
                        <label class="label">
                            <input
                            type="radio"
                            id="value-${endereco.id}"
                            name="value-radio"
                            value="value-${endereco.id}"
                            />
                            <p class="text">${enderecoAbreviado}</p>
                        </label>
                    `;

                    document.querySelectorAll('input[name="value-radio"]').forEach(radio => {
                        radio.addEventListener('change', function () {
                            gerarFretes();
                        });
                    });

                }
            });

        })

        .catch(error => {
            console.error('Erro ao buscar informações do cliente:', error);
            alert("Erro ao buscar informações do cliente. Por favor, tente novamente.");
        });
}

function pegarEscolhausuario() {
    let escolha = document.querySelector('input[name="value-radio"]:checked').value;
    let id = escolha.split('-')[1];
    return id;
}

