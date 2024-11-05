let pedidos = []; // Declara a variável pedidos como global
var clienteId = localStorage.getItem("clienteId");

async function carregarPedidos() {
    console.log('Carregando pedidos...');

    if (!clienteId) {
        // Exibe a mensagem de "Sem pedidos" e oculta a tabela se não houver clienteId
        document.getElementById("empty-order").style.display = "block";
        document.getElementById("conteudo-pedidos").style.display = "none";
        console.error('ID do cliente não encontrado.');
        return; // Interrompe a execução se não houver clienteId
    }

    try {
        const response = await fetch(`http://${API}:8080/pedido/${clienteId}`);
        
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        pedidos = await response.json(); // Armazena os pedidos na variável global
        console.log('Dados recebidos:', pedidos);

        const tbody = document.getElementById('table-group-divider');
        tbody.innerHTML = ""; // Limpa o conteúdo anterior do tbody

        // Verifica se há pedidos e exibe a tabela ou a mensagem de "Sem pedidos"
        if (pedidos.length > 0) {
            pedidos.forEach(pedido => {
                const row = document.createElement('tr');
                const dataPedidoFormatada = pedido.dataPedido
                    ? pedido.dataPedido.split('T')[0]
                    : "Data não disponível";

                row.innerHTML = `
                    <td>${pedido.id}</td>
                    <td>${dataPedidoFormatada}</td>
                    <td>${pedido.status || "Status não disponível"}</td>
                    <td>R$ ${(pedido.total).toFixed(2) || "Valor não disponível"}</td>
                    <td class="text-center"><button onclick="mostrarDetalhes(${pedido.id})">Detalhes</button></td>
                `;
                tbody.appendChild(row);
            });
            document.getElementById("empty-order").style.display = "none"; // Oculta a mensagem de "Sem pedidos"
            document.getElementById("conteudo-pedidos").style.display = "block"; // Exibe a tabela
        } else {
            document.getElementById("empty-order").style.display = "block"; // Exibe a mensagem de "Sem pedidos"
            document.getElementById("conteudo-pedidos").style.display = "none"; // Oculta a tabela
        }

    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        document.getElementById("empty-order").style.display = "block"; // Exibe a mensagem de "Sem pedidos"
        document.getElementById("conteudo-pedidos").style.display = "none"; // Oculta a tabela
    }
}

async function mostrarDetalhes(pedidoId) {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;

    const endpoint = `http://${API}:8080/pedido/detalhe/${pedidoId}`;
    fetch(endpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const modal = document.getElementById('detalhesModal');
            const modalContent = document.getElementById('modalContent');
            modalContent.innerHTML = `
                <h2>Detalhes do Pedido #${pedido.id}</h2>
                <p><strong>Data:</strong> ${data.dataPedido.split('T')[0]}</p>
                <p><strong>Status:</strong> ${data.status}</p>
                <p><strong>Forma de pagamento:</strong> ${data.formaPagamento}</p>
                <p><strong>Frete:</strong> R$ ${data.frete.toFixed(2)}</p>
                <p><strong>Total:</strong> R$ ${data.valorTotal.toFixed(2)}</p>
                <h3>Endereço de entrega:</h3>
                <p><strong>CEP:</strong> ${data.endereco.cep}</p>
                <p><strong>Logradouro:</strong> ${data.endereco.logradouro}</p>
                <p><strong>Número:</strong> ${data.endereco.numero}</p>
                <p><strong>Bairro:</strong> ${data.endereco.bairro}</p>
                <p><strong>Cidade:</strong> ${data.endereco.cidade} - ${data.endereco.uf}</p>
                <h3>Itens:</h3>
                <ul>
                    ${data.produtoQtd.map(item => `
                        <li>${item.nome} - Quantidade: ${item.quantidade} - Preço Unitário: R$ ${item.valorUnitario.toFixed(2)}</li>
                    `).join('')}
                </ul>
                <button class="btn-fechar" onclick="fecharModal()">X</button>
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

// Executa a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarPedidos);
