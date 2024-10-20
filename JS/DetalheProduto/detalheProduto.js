var grupoUsuarioLogado = localStorage.getItem("grupo");

let productId = parseInt(localStorage.getItem("IdProdutoDetalhes"));

var produtosIDCarrinho = JSON.parse(localStorage.getItem("produtos")) || [];

function visualizarProduto(produtoId) {
    const carrosselImagens = document.querySelector(".swiper-wrapper");
    const nomeProd = document.querySelector(".titulo-prod");
    const valorProd = document.querySelector(".valor-prod");
    const avaliacaoProd = document.querySelector(".avaliacao-prod");
    const descricaoProd = document.querySelector(".descricao-prod");

    fetch('http://' + API + ':8080/produto/buscaID?id=' + produtoId)
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }
        })
        .then(produto => {
            // Adiciona a imagem principal
            let indexImage = 0;
            carrosselImagens.innerHTML = `
                <div class="swiper-slide">
                    <div class="project-img">
                        <img src="${produto.imagemPrincipal}" alt="Imagem produto ${indexImage++}">
                    </div>
                </div>
            `;
            atualizarInstanciaSwiper();

            // Adiciona imagens adicionais, se houver
            if (produto.imagens && produto.imagens.length > 0) {
                atualizarLoopSwiper(true);
                produto.imagens.forEach(imagenProduto => {
                    carrosselImagens.innerHTML += `
                        <div class="swiper-slide">
                            <div class="project-img">
                                <img src="${imagenProduto}" alt="Imagem produto ${indexImage++}">
                            </div>
                        </div>
                    `;
                });
                atualizarInstanciaSwiper();
            }

            let estrelasAvaliacao = `<p>Avaliação: ${addEstrelasAvaliação(produto.avaliacao)}</p>`;

            nomeProd.innerText = produto.nomeProduto;
            valorProd.innerText = "R$ " + produto.preco;
            avaliacaoProd.innerHTML = estrelasAvaliacao;
            descricaoProd.innerText = produto.descricao;

        })
        .catch(error => {
            console.error('Erro ao acessar produto:', error);
            alert("Erro ao acessar produto. Por favor, tente novamente.");
        });
}

document.addEventListener('DOMContentLoaded', () => {
    visualizarProduto(productId);
});

function addEstrelasAvaliação(qtdEstrelas) {
    let estrelasHTML = '';
    const estrelasCheias = Math.floor(qtdEstrelas); // Número de estrelas cheias
    const temEstrelaMeia = (qtdEstrelas % 1) >= 0.5; // Verifica se tem estrela meia

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

    return estrelasHTML;
}

function adicionarCarrinho() {
    produtosIDCarrinho.push(productId);
    localStorage.setItem("produtos", JSON.stringify(produtosIDCarrinho));
    window.location.href = "TelaCarrinho.html";
}

