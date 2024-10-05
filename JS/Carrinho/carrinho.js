// var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

let listaSalva = JSON.parse(localStorage.getItem("produtos"));

if (listaSalva) {
    console.log(listaSalva);
} else {
    console.log("Nenhum produto salvo");
}

document.addEventListener('DOMContentLoaded', () => {
    const carrinhoBuscarNLRequestDTO = {
        "listaIds": listaSalva
    }
    buscarCarrinhoNL(carrinhoBuscarNLRequestDTO);
})

async function buscarCarrinhoNL(listaIdProdutos) {
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

    const result = await response.json();
    const conteudo = document.querySelector(".content");
    const prodCarrinho = document.querySelector(".produtoCarrinho");
    prodCarrinho.innerHTML = '';
    prodCarrinho.innerHTML = `<thead>
                        <tr>
                            <th>Produto</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Total</th>
                            <th>-</th>
                        </tr>
                    </thead>`;    
    result.produtos.forEach(produtoCarrinho => {
        const row = document.createElement('tbody');
        row.innerHTML = `
                        <tr>
                            <td>
                                <div class="product">
                                    <img src="${produtoCarrinho.produto.urlImagemPrincipal}" alt="" />
                                    <div class="info">
                                        <div class="name">${produtoCarrinho.produto.nomeProduto}</div>
                                        <div class="category">${produtoCarrinho.produto.categoria}</div>
                                    </div>
                                </div>
                            </td>
                            <td>${produtoCarrinho.produto.preco}</td>
                            <td>
                                <div class="qty">
                                    <button><i class="bx bx-minus"></i></button>
                                    <span>${produtoCarrinho.quantidade}</span>
                                    <button><i class="bx bx-plus"></i></button>
                                </div>
                            </td>
                            <td>${produtoCarrinho.produto.preco * produtoCarrinho.quantidade}</td>
                            <td>
                                <button class="remove"><i class="bx bx-x"></i></button>
                            </td>
                        </tr>
            `;
            prodCarrinho.appendChild(row);
    });
    conteudo.innerHTML += `<aside>
                <div class="box">
                    <header>Resumo da compra</header>
                    <div class="info">
                        <div><span>Sub-total</span><span>R$ 418</span></div>
                        <div><span>Frete</span><span>Gratuito</span></div>
                        <div>
                            <button>
                                Adicionar cupom de desconto
                                <i class="bx bx-right-arrow-alt"></i>
                            </button>
                        </div>
                    </div>
                    <footer>
                        <span>Total</span>
                        <span>R$ 418</span>
                    </footer>
                </div>
                <button>Finalizar Compra</button>
            </aside>`;
}