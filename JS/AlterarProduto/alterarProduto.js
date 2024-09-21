// var API = "4.228.231.177"; // Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; // Setar essa variavel quando testar local e comentar a do IP

var grupoUsuarioLogado = localStorage.getItem("grupo");

document.addEventListener('DOMContentLoaded', (event) => {
    if (grupoUsuarioLogado === "Admin") {
        const produtoId = getProdutoIdFromURL(); // Supondo que você tenha uma função para obter o ID do produto da URL
        if (produtoId) {
            acessarProduto(produtoId);
        }

        const modal = document.getElementById("alterationModal");
        const span = document.getElementsByClassName("close")[0];

        // Quando o usuário clica em <span> (x), fecha o modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // Quando o usuário clica fora do modal, fecha o modal
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    } else if (grupoUsuarioLogado === "Estoquista") {
        const produtoId = getProdutoIdFromURL();
        if (produtoId) {
            acessarProduto(produtoId);
        }
    }
});

function acessarProduto(produtoId) {
    fetch('http://' + API + ':8080/produto/buscaID?id=' + produtoId)
        .then(response => response.json())
        .then(produto => {
            document.getElementById('nomeProduto').value = produto.nomeProduto;
            document.getElementById('descricao').value = produto.descricao;
            document.getElementById('preco').value = produto.preco;
            document.getElementById('avaliacao').value = produto.avaliacao;
            document.getElementById('quantidade').value = produto.quantidade;
            document.getElementById('marca').value = produto.marca;
            document.getElementById('categoria').value = produto.categoria;
            const imgPrincipal = document.querySelector('.exibir-img-principal');
            const imgAdicionais = document.querySelector('.exibir-img-adicionais');

            if (produto.imagemPrincipal) {
                imgPrincipal.innerHTML = `
                    <label>Imagem principal:</label>
                    <img src="${produto.imagemPrincipal}" alt="Imagem principal do produto" style="max-width: 100%;">
                        `;
                // tableBody.appendChild(row);
            }
            // Exibir imagens adicionais se disponíveis
            if (produto.imagens && produto.imagens.length > 0) {
                produto.imagens.forEach(item => {
                    imgAdicionais.innerHTML = `
                    <label>Imagem adicionais:</label>
                    <img src="${item}" alt="Imagem principal do produto" style="max-width: 50%;">
                        `;
                });
            }
       
             // Desabilitar campos se o usuário for Estoquista
             if (grupoUsuarioLogado === "Estoquista") {
                document.getElementById('nomeProduto').disabled = true;
                document.getElementById('descricao').disabled = true;
                document.getElementById('preco').disabled = true;
                document.getElementById('avaliacao').disabled = true;
                document.getElementById('marca').disabled = true;
                document.getElementById('categoria').disabled = true;
                document.getElementById('imagemPrincipal').disabled = true;
                document.getElementById('imagensAdicionais').disabled = true;

                // Habilitar botões de salvar e cancelar e o campo de quantidade
                document.getElementById('botaoSalvar').disabled = false;
                document.getElementById('botaoCancelar').disabled = false;
                document.getElementById('quantidade').disabled = false;
            }
       
        })
        .catch(error => {
            console.error('Erro ao acessar produto:', error);
            alert("Erro ao acessar produto. Por favor, tente novamente.");
        });
}

// Função para exibir o modal com uma mensagem
function showModal(message) {
    const modal = document.getElementById("alterationModal");
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message;
    modal.style.display = "block";
}


// Função para exibir uma imagem
function displayImage(file, displayElement, maxWidth) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = "Imagem do produto";
        img.style.maxWidth = maxWidth;
        displayElement.appendChild(img);
    };
    reader.onerror = function (error) {
        console.error("Erro ao ler o arquivo:", error);
    };
    reader.readAsDataURL(file);
}

// Supondo que você tenha uma função para obter o ID do produto da URL
function getProdutoIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function directToListagemProdutos() {
    window.location.href = "TelaListagemProdutoAdm.html";
}