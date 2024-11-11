const resumoPedido = JSON.parse(localStorage.getItem("resumoPedido"));
const formaPagamento = localStorage.getItem("formaPagamento");
let listaSalva = JSON.parse(localStorage.getItem("produtos"));
var clienteId = localStorage.getItem("clienteId");
let produtoQtd = [];

document.addEventListener('DOMContentLoaded', () => {
    const carrinhoBuscarNLRequestDTO = {
        "listaIds": listaSalva
    }
    buscarCarrinhoNL(carrinhoBuscarNLRequestDTO);
});

async function buscarCarrinhoNL(listaIdProdutos) {
    await carregaCarrinho(listaIdProdutos);
    const conteudo = document.querySelector(".content");
    let usuarioAutenticado = localStorage.getItem("autenticadoCliente");
    if (usuarioAutenticado) {
        conteudo.innerHTML += `<aside>
                <div class="box">
                    <header class="header-box">
                        <img src="src/img/carrinho-de-compras.png" alt="imagem carrinho"/>
                        <p>Resumo da compra</p>
                    </header>
                    <div class="info">
                        <div><span>Produtos:</span><span class="subtotal-produtos">${resumoPedido.subtotal}</span></div>
                        <div><span>Frete:</span><span class="frete-carrinho">${resumoPedido.frete}</span></div>
                        <div><span>Pagamento:</span><span>${formaPagamento}</span></div>
                    </div>
                    <footer>
                        <span>Total</span>
                        <span>${resumoPedido.total}</span>
                    </footer>
                </div>
                
                <div class="box entrega">
                    <header class="header-box">
                        <img src="src/img/entrega-rapida.png" alt="imagem carrinho"/>
                        <p>Entrega</p>
                    </header>
                     <p>Entrega prevista em 5 dias úteis</p>
                </div>

                <div class="btn-finali-conti">
                    <button class="btn-finalizar">FINALIZAR COMPRA</button>
                    <button class="btn-continuar" onclick="directToTelaPagamento()">VOLTAR</button>
                </div>
            </aside>`;
    }

    document.querySelector('.btn-finalizar').addEventListener('click', () => {
        gravarPedido();
    });
}

async function carregaCarrinho(listaIdProdutos) {
    const response = await fetch('http://' + API + ':8080/api/carrinho/buscarCarrinhoNL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(listaIdProdutos)
    });

    if (!response.ok) {
        throw new Error('Erro ao cadastrar produto: ' + response.statusText);
    }

    totalProdutos = 0;
    const result = await response.json();
    const prodCarrinho = document.querySelector(".produtoCarrinho");
    prodCarrinho.innerHTML = '';
    prodCarrinho.innerHTML = `<thead>
                        <tr>
                            <th>Imagem</th>
                            <th>Produto</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Total</th>
                        </tr>
                    </thead>`;
    result.produtos.forEach(produtoCarrinho => {
        var produto = {
            idProduto: produtoCarrinho.produto.id,
            quantidade: produtoCarrinho.quantidade,
            valorUnitario: produtoCarrinho.produto.preco
        }
        produtoQtd.push(produto);
        const row = document.createElement('tbody');
        row.innerHTML = `
                        <tr>
                            <td>
                                <img src="${produtoCarrinho.produto.urlImagemPrincipal}" alt="Imagem produto" />
                            </td>
                            <td>
                                <div class="product">
                                    <div class="info">
                                        <div class="name">${produtoCarrinho.produto.nomeProduto}</div>
                                        <div class="category">${produtoCarrinho.produto.categoria}</div>
                                    </div>
                                </div>
                            </td>
                            <td>R$ ${produtoCarrinho.produto.preco}</td>
                            <td>
                                <div class="qty">
                                    <span class="quantidade">${produtoCarrinho.quantidade}</span>
                                </div>
                            </td>
                            <td>R$ ${(produtoCarrinho.produto.preco * produtoCarrinho.quantidade).toFixed(2)}</td>
                        </tr>
            `;
        totalProdutos += produtoCarrinho.produto.preco * produtoCarrinho.quantidade;
        prodCarrinho.appendChild(row);
    });
}

function gravarPedido() {
    mostrarProcessamentoPagamento()
    let pagamento;
    if (formaPagamento === 'Cartão de Crédito') {
        pagamento = 'CARTAO_CREDITO';
    }
    const pedido = {
        produtoQtd: produtoQtd,
        formaPagamento: (formaPagamento === 'PIX') ? 'PIX' : pagamento,
        frete: parseFloat((resumoPedido.frete).replace("R$", "").trim()),
        clienteId: clienteId,
        enderecoId: resumoPedido.enderecoId
    };

    fetch(`http://${API}:8080/pedido/cadastrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    })
        .then(response => {
            if (!response.ok) {
                document.querySelector("main").classList.remove('blur');
                esconderLoading();
                throw new Error('Erro ao concluir pedido: ' + response.statusText);
            }
            return response.json();
        })
        .then(pedido => {
            setTimeout(function () {
                esconderLoading();
                document.querySelector(".card-concluido").style.display = "flex";
                document.querySelector(".modal-confirm").innerHTML = `
                    <p class="modal-heading">Pedido realizado com sucesso!</p>
                    <p class="modal-info">Número do pedido: ${pedido.id}</p>
                    <p class="modal-info">Valor total do pedido: ${pedido.valorTotal}</p>
                    <div class="button-wrapper">
                        <button class="accept-cookie-button">OK</button>
                    </div>`;
                localStorage.setItem("produtos", JSON.stringify([]));
                document.querySelector(".accept-cookie-button").addEventListener("click", redirecionarParaTelaProduto);
            }, 3600);
        })
        .catch(error => {
            esconderLoading();
            document.querySelector("main").classList.remove('blur');
            console.error('Erro ao concluir pedido:', error);
            alert('Erro ao concluir pedido. Por favor, tente novamente.');
        });
}
