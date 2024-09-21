// var API = "4.228.231.177"; // Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; // Setar essa variavel quando testar local e comentar a do IP

var grupoUsuarioLogado = localStorage.getItem("grupo");
var removedAdditionalImages = [];  // Para armazenar as URLs das imagens adicionais removidas
var existingImages = [];  // Lista para armazenar URLs das imagens existentes
var newImages = [];  // Lista para armazenar os novos arquivos de imagem

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

            // Exibir imagem principal
            if (produto.imagemPrincipal) {
                showExistingMainImage(produto.imagemPrincipal);
            }

            // Exibir imagens adicionais, se disponíveis
            if (produto.imagens && produto.imagens.length > 0) {
                showExistingAdditionalImages(produto.imagens);
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

// Função para exibir imagem principal existente
function showExistingMainImage(url) {
    const mainImageContainer = document.querySelector('.exibir-img-principal');
    mainImageContainer.innerHTML = `
        <label>Imagem Principal:</label>
        <div class="img-wrapper">
            <img src="${url}" class="img-principal">
            <button class="btn-alterar-principal">Alterar imagem principal</button>
            <input type="file" class="input-alterar-principal" style="display: none;">
        </div>
    `;

    const alterarBtn = document.querySelector('.btn-alterar-principal');
    const inputFile = document.querySelector('.input-alterar-principal');

    alterarBtn.addEventListener('click', function(event) {
        event.preventDefault();  // Previne a ação padrão do botão
        inputFile.click();  // Abre o gerenciador de arquivos
    });

    inputFile.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const newImageUrl = e.target.result;
                mainImageContainer.querySelector('.img-principal').src = newImageUrl;  // Atualiza a imagem principal
            };
            reader.readAsDataURL(file);
        }
    });
}

// Função para exibir imagens adicionais existentes
function showExistingAdditionalImages(urls) {
    existingImages = urls;  // Armazena as URLs das imagens existentes
    const additionalImagesContainer = document.querySelector('.exibir-img-adicionais');
    additionalImagesContainer.innerHTML = '';  // Limpa a pré-visualização

    additionalImagesContainer.innerHTML = `
        <label>Imagens adicionais:</label>
        <div class="img-grid"></div>
    `;

    const imgGrid = additionalImagesContainer.querySelector('.img-grid');

    urls.forEach((url, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('img-wrapper');

        imgWrapper.innerHTML = `
            <img src="${url}" class="img-principal">
            <button class="btn-remove" type="button-remove">
                <span class="btn-remove__text">Excluir</span>
                <span class="btn-remove__icon">
                    <svg class="svg" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path>
                        <line style="stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" x1="80" x2="432" y1="112" y2="112"></line>
                        <path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path>
                        <line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="256" x2="256" y1="176" y2="400"></line>
                        <line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="184" x2="192" y1="176" y2="400"></line>
                        <line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="328" x2="320" y1="176" y2="400"></line>
                    </svg>
                </span>
            </button>
        `;

        const removeBtn = imgWrapper.querySelector('.btn-remove');
        removeBtn.addEventListener('click', function() {
            existingImages.splice(index, 1);  // Remove a URL da lista
            showExistingAdditionalImages(existingImages);  // Re-renderiza imagens
        });

        imgGrid.appendChild(imgWrapper);
    });

    document.getElementById('imagens').addEventListener('change', function() {
        previewImages(this, 'img-grid');
    });
}

function previewImages(input, previewContainerClass) {
    const previewContainer = document.querySelector(`.${previewContainerClass}`);
    let files = Array.from(input.files);

    newImages = newImages.concat(files);  // Adiciona novos arquivos à lista de novas imagens

    previewContainer.innerHTML = '';  // Limpa a pré-visualização

    // Exibe imagens existentes
    existingImages.forEach((url, index) => {
        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('img-wrapper');

        imgWrapper.innerHTML = `
            <img src="${url}" class="img-principal">
            <button class="btn-remove" type="button-remove">
                <span class="btn-remove__text">Excluir</span>
                <span class="btn-remove__icon">
                    <svg class="svg" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
                        <path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path>
                        <line style="stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" x1="80" x2="432" y1="112" y2="112"></line>
                        <path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path>
                        <line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="256" x2="256" y1="176" y2="400"></line>
                        <line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="184" x2="192" y1="176" y2="400"></line>
                        <line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="328" x2="320" y1="176" y2="400"></line>
                    </svg>
                </span>
            </button>
        `;

        const removeBtn = imgWrapper.querySelector('.btn-remove');
        removeBtn.addEventListener('click', function() {
            existingImages.splice(index, 1);  // Remove a URL da lista
            previewImages(input, previewContainerClass);  // Re-renderiza imagens
        });

        previewContainer.appendChild(imgWrapper);
    });

    // Exibe novas imagens
    newImages.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgWrapper = document.createElement('div');
            imgWrapper.classList.add('img-wrapper');

            imgWrapper.innerHTML = `
                <img src="${e.target.result}" class="img-principal">
                <button class="btn-remove" type="button-remove">
                    <span class="btn-remove__text">Excluir</span>
                    <span class="btn-remove__icon">
                        <svg class="svg" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg">
                            <path d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path>
                            <line style="stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px" x1="80" x2="432" y1="112" y2="112"></line>
                            <path d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40" style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></path>
                            <line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="256" x2="256" y1="176" y2="400"></line>
                            <line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="184" x2="192" y1="176" y2="400"></line>
                            <line style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px" x1="328" x2="320" y1="176" y2="400"></line>
                        </svg>
                    </span>
                </button>
            `;

            const removeBtn = imgWrapper.querySelector('.btn-remove');
            removeBtn.addEventListener('click', function() {
                newImages.splice(index, 1);  // Remove o arquivo da lista
                updateFileInput(input, newImages);  // Atualiza o campo de entrada de arquivos
                previewContainer.existingFiles = newImages;  // Atualiza a lista de imagens globais
                previewImages(input, previewContainerClass);  // Re-renderiza imagens
            });

            previewContainer.appendChild(imgWrapper);
        };
        reader.readAsDataURL(file);
    });
}

function updateFileInput(input, files) {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    input.files = dataTransfer.files;
}

// Adiciona evento ao botão "Escolha novas imagens adicionais"
document.getElementById('addImagesButton').addEventListener('click', function() {
    document.getElementById('imagens').click();
});

// Função para direcionar à listagem de produtos
function directToListagemProdutos() {
    window.location.href = "TelaListagemProdutoAdm.html";
}

// Função para obter o ID do produto da URL
function getProdutoIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}
