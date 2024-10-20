data = [];

var produtosIDCarrinho = JSON.parse(localStorage.getItem("produtos")) || [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProduto();
})

async function fetchProduto() {
    
    try {
        const response = await fetch(`http://${API}:8080/produto/listagemAtivos`, {
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

            // Adiciona estrelas cheias (SVG)
            for (let i = 0; i < estrelasCheias; i++) {
                estrelasHTML += `
                    <svg height="24px" width="24px" class="star filled" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g><g><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521
                            c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506
                            c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625
                            c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191
                            s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586
                            s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path></g></g>
                    </svg>`;
            }

            // Adiciona estrela meia se necessário (SVG)
            if (temEstrelaMeia) {
                estrelasHTML += `
                    <svg height="24px" width="24px" class="star half" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="half-fill" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="50%" style="stop-color:#ffeb49;stop-opacity:1" />
                                <stop offset="50%" style="stop-color:#666;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <g>
                            <path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521
                                c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506
                                c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625
                                c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191
                                s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586
                                s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z">
                            </path>
                        </g>
                    </svg>
                `;
            }


            // Adiciona estrelas vazias (SVG)
            const estrelasVazias = 5 - estrelasCheias - (temEstrelaMeia ? 1 : 0);
            for (let i = 0; i < estrelasVazias; i++) {
                estrelasHTML += `
                    <svg height="24px" width="24px" class="star empty" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <g><g><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521
                            c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506
                            c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625
                            c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191
                            s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586
                            s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path></g></g>
                    </svg>`;
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
                            <button onclick="directToDetalheProduto(${produto.id})" class="btn btn-primary">Detalhes do produto</button>

                            <button onclick="adicionarCarrinho(${produto.id})" class="btn-comprar">
                                <svg viewBox="0 0 16 16" class="bi bi-cart-check" height="24" width="24"
                                    xmlns="http://www.w3.org/2000/svg" fill="#fff">
                                    <path
                                        d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z">
                                    </path>
                                    <path
                                        d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z">
                                    </path>
                                </svg>
                                <p class="text">Comprar</p>
                            </button>
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

function directToDetalheProduto(produtoId) {
    localStorage.setItem("IdProdutoDetalhes", produtoId);
    window.location.href = "TelaDetalheProduto.html";
}

function sair() {
    // Limpar dados do usuário armazenados no localStorage
    localStorage.removeItem("usuarioLogado");

    // Exibir o modal de logout
    var logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    logoutModal.show();

}