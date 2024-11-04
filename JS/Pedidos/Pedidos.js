
let pedidos = []; // Declara a variável pedidos como global
var clienteId = localStorage.getItem("clienteId");

async function carregarPedidos() {
    console.log('Carregando pedidos...');
    try {
        const response = await fetch('http://localhost:8080/pedido/'+clienteId);
        pedidos = await response.json(); // Armazena os pedidos na variável global
        console.log('Dados recebidos:', pedidos);

        const tbody = document.getElementById('table-group-divider');
        tbody.innerHTML = ""; // Limpa o conteúdo anterior do tbody

        pedidos.forEach(pedido => {
            const row = document.createElement('tr');

            const dataPedidoFormatada = pedido.dataPedido
                ? pedido.dataPedido.split('T')[0]
                : "Data não disponível";

            row.innerHTML = `
                <td>${pedido.id}</td>
                <td>${dataPedidoFormatada}</td>
                <td>${pedido.status || "Status não disponível"}</td>
                <td>R$ ${(pedido.valorTotal).toFixed(2) || "Valor não disponível"}</td>
                <td><button onclick="mostrarDetalhes(${pedido.id})">Detalhes</button></td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
    }
}

function mostrarDetalhes(pedidoId) {
    // Encontra o pedido selecionado na lista global de pedidos
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    // Endpoint para obter detalhes do pedido, incluindo o endereço
    const endpoint = `http://localhost:8080/pedido/${pedidoId}/itens`;

    // Realiza a requisição ao endpoint para obter o endereço de entrega
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            // Exibe os dados do pedido e do endereço no modal
            const modal = document.getElementById('detalhesModal');
            const modalContent = document.getElementById('modalContent');
            modalContent.innerHTML = `
                <h2>Detalhes do Pedido #${pedido.id}</h2>
                <p><strong>Data:</strong> ${pedido.dataPedido.split('T')[0]}</p>
                <p><strong>Status:</strong> ${pedido.status}</p>
                <p><strong>Forma de pagamento:</strong> ${pedido.formaPagamento}</p>
                <p><strong>Total:</strong> R$ ${(pedido.valorTotal).toFixed(2)}</p>
                <h3>Endereço de entrega:</h3>
                <p><strong>CEP:</strong> ${data.endereco.cep}</p>
                <p><strong>Logradouro:</strong> ${data.endereco.logradouro}</p>
                <p><strong>Número:</strong> ${data.endereco.numero}</p>
                <p><strong>Bairro:</strong> ${data.endereco.bairro}</p>
                <p><strong>Cidade:</strong> ${data.endereco.cidade} - ${data.endereco.uf}</p>
                <h3>Itens:</h3>
                <ul>
                    ${pedido.itemPedidoModel.map(item => `
                        <li>${item.id.produtoId.nomeProduto} - Quantidade: ${item.quantidade} - Preço Unitário: R$ ${item.valorUnitario.toFixed(2)}</li>
                    `).join('')}
                </ul>
                <button onclick="fecharModal()">Fechar</button>
            `;
            modal.style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao buscar detalhes do pedido:', error);
            alert('Não foi possível carregar os detalhes do pedido.');
        });
}

function fecharModal() {
    document.getElementById('detalhesModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', carregarPedidos);
