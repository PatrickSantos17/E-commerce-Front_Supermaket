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
            // Gerar estrelas com base na avaliação
            const avaliacao = produto.avaliacao;
            let estrelasHTML = '';
            const estrelasCheias = Math.floor(avaliacao); // Número de estrelas cheias
            const temEstrelaMeia = (avaliacao % 1) >= 0.5; // Verifica se tem estrela meia

            // Adiciona estrelas cheias
            for (let i = 0; i < estrelasCheias; i++) {
                estrelasHTML += '<span class="star filled">★</span>'; // Estrela cheia
            }

            // Adiciona estrela meia se necessário
            if (temEstrelaMeia) {
                estrelasHTML += '<span class="star half">★</span>'; // Estrela meia
            }

            // Adiciona estrelas vazias
            const estrelasVazias = 5 - estrelasCheias - (temEstrelaMeia ? 1 : 0);
            for (let i = 0; i < estrelasVazias; i++) {
                estrelasHTML += '<span class="star">☆</span>'; // Estrela vazia
            }

            produtosHTML += `
                <div class="col product-col">
                    <div class="card h-100 card-sm">
                        <img src="${produto.urlImagemPrincipal}" class="card-img-top img-sm" alt="${produto.nomeProduto}">
                        <div class="card-body">
                            <div class="produtos-nome">
                                <h5 class="card-title">${produto.nomeProduto}</h5>
                                <hr>
                            </div>
                            <p class="card-text"><strong>R$ ${formatarCasasDecimais(produto.preco)}</strong></p>
                            <p>Avaliação: ${estrelasHTML}</p> <!-- Aqui estão as estrelas -->
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