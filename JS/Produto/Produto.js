// var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

data = [];

var produtosIDCarrinho = JSON.parse(localStorage.getItem("produtos")) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProduto();
    console.log(produtosIDCarrinho);
})

async function fetchProduto() {
    try {
        const response = await fetch(`http://localhost:8080/produto/listagem`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        console.log(result);  // Verifique a estrutura da resposta
        data = result.produtos; // Acessa o array de produtos
        montarLayoutExibicao(data);

    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

function montarLayoutExibicao(produtos) {
    const listaProdutos = document.getElementById('product-list');
    listaProdutos.innerHTML = '';

    let produtosHTML = '';

    produtos.forEach(produto => {
        if (produto.ativo) {  // Apenas exibe produtos ativos
            document.querySelectorAll('.card').forEach(card => {
                card.classList.add('card-sm');
            });            
            produtosHTML += `
                <div class="col product-col">
                    <div class="card h-100">
                        <img src="${produto.urlImagemPrincipal}" class="card-img-top img-sm" alt="${produto.nomeProduto}">
                        <div class="card-body">
                            <div class="produtos-nome">
                                <h5 class="card-title">${produto.nomeProduto}</h5>
                                <hr>
                            </div>
                            <p class="card-text"><strong>R$ ${formatarCasasDecimais(produto.preco)}</strong></p>
                            <p>Avaliação: ${produto.avaliacao}</p>
                            <a href="TelaDetalheProduto.html?produtoId=${produto.id}" class="btn btn-primary">Detalhes do produto</a>
                            <button onclick="adicionarCarrinho(${produto.id})" class="btn btn-primary">Comprar</button>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    listaProdutos.innerHTML = produtosHTML;
}

function formatarCasasDecimais(numero) {
    return Number(numero).toFixed(2);
}

function redirecionarTelaLogin() {
    window.location.href = "Login.html"
}

function adicionarCarrinho(produtoId) {
    produtosIDCarrinho.push(produtoId);
    localStorage.setItem("produtos", JSON.stringify(produtosIDCarrinho));
    window.location.href = "TelaCarrinho.html";
}