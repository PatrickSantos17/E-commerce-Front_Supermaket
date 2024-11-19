
let grupoEstoquista = localStorage.getItem("grupo");

console.log('Grupo do estoquista:', grupoEstoquista);

async function carregarPedidos() {
    console.log('Carregando pedidos...');

    try {
        const response = await fetch(`http://${API}:8080/pedido/`+grupoEstoquista);
        
        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        pedidos = await response.json(); // Armazena os pedidos na variável global

        console.log('Dados recebidos:', pedidos);

        const tbody = document.getElementById('table-group-divider');
        tbody.innerHTML = ""; // Limpa o conteúdo anterior do tbody

        // Itera pelos pedidos e os adiciona à tabela
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
                <td class="text-center"><button onclick="mostrarDetalhes(${pedido.id})">Editar Status</button></td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        alert('Erro ao carregar os pedidos. Tente novamente mais tarde.');
    }
}



function fecharModal() {
    document.getElementById('detalhesModal').style.display = 'none';
}

// Executa a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarPedidos);
