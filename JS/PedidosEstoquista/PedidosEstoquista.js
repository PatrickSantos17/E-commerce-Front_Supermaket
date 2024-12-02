
let grupoEstoquista = localStorage.getItem("grupo");

console.log('Grupo do estoquista:', grupoEstoquista);

async function carregarPedidos() {
    console.log('Carregando pedidos...');

    try {
        if (grupoEstoquista === "Estoquista") {
            const response = await fetch(`http://${API}:8080/pedido/` + grupoEstoquista);

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }

            pedidos = await response.json();

            console.log('Dados recebidos:', pedidos);

            const tbody = document.querySelector('tbody');
            tbody.innerHTML = ""; 

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
                <td class="text-center"><button onclick="openModalStatusPedido('${JSON.stringify(pedido).replace(/'/g, "\\'").replace(/"/g, '&quot;')}')">Editar pedido</button></td>
            `;
                tbody.appendChild(row);
            });
        } else {
            alert("Apenas estoquistas têm permissão para acessar essa página.");
            window.location.href = "TelaLogin.html";
        }

    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        alert('Erro ao carregar os pedidos. Tente novamente mais tarde.');
    }
}

function alterarStatusPedido(alterarPedidoDTO) {
    fetch(`http://${API}:8080/pedido/alterarStatus`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(alterarPedidoDTO)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao alterar status: ' + response.statusText);
            }
            document.querySelector(".modal-overlay").style.display = "flex";
        })
        .catch(error => {
            console.error('Erro ao alterar cliente:', error);
            alert('Erro ao alterar cliente. Por favor, tente novamente.');
        });
}

function openModalStatusPedido(pedidoString) {
    const pedido = JSON.parse(pedidoString);
    document.getElementById('cartao-alterarStatus').style.display = 'flex';
    document.querySelector('.nPedido').value = pedido.id;
    document.querySelector('.valor').value = "R$: " + (pedido.total).toFixed(2) || "Valor não disponível";
    document.querySelector('#status').value = pedido.status || "Status não disponível";
    document.querySelector('.cancelar').addEventListener('click', (event) => {
        event.preventDefault();
        closeModalStatusPedido();
    });
    document.querySelector('.close').addEventListener('click', (event) => {
        event.preventDefault();
        closeModalStatusPedido();
    });
    document.querySelector('.alterar').addEventListener('click', (event) => {
        event.preventDefault();
        const alterarPedidoDTO = {
            idPedido: pedido.id,
            status: document.querySelector('#status').value
        };
        alterarStatusPedido(alterarPedidoDTO);
    });
}

function closeModalStatusPedido() {
    document.getElementById('cartao-alterarStatus').style.display = 'none';
}

document.querySelector('.accept-cookie-button').addEventListener('click', function (event) {
    location.reload();
});

document.addEventListener('DOMContentLoaded', carregarPedidos);
