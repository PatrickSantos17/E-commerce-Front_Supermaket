let userId = localStorage.getItem("clienteId");

const checkbox = document.getElementById('checkEndereco');
const entregaPadrao = document.querySelector(".entrega-selecionada");

window.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('checkEndereco');

    if (checkbox) {
        checkbox.addEventListener('change', function() {
            console.log('Checkbox foi clicado! Novo estado:', this.checked);
        });
    } else {
        console.error('Checkbox não encontrado no DOM!');
    }
});


function buscarEnderecoPadrao(userId) {
    fetch(`http://${API}:8080/cliente/enderecoEntrega/${userId}`)
        .then(response => response.json())
        .then(endereco => {
            let enderecoAbreviado = endereco.logradouro + ', ' + endereco.numero + ' - CEP: ' + endereco.cep;

            // Atualiza o conteúdo da entrega-selecionada
            entregaPadrao.innerHTML = `
                <p class="entrega-padrao">${enderecoAbreviado}</p>
            `;
        })
        .catch(error => {
            console.error('Erro ao buscar endereço de entrega:', error);
            alert("Erro ao buscar endereço de entrega. Por favor, tente novamente.");
        });
}
