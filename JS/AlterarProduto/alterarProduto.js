// var API = "4.228.231.177"; // Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; // Setar essa variavel quando testar local e comentar a do IP

var grupoUsuarioLogado = localStorage.getItem("grupo");
var removedAdditionalImages = [];  // Para armazenar as URLs das imagens adicionais removidas

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
        })
        .catch(error => {
            console.error('Erro ao acessar produto:', error);
            alert("Erro ao acessar produto. Por favor, tente novamente.");
        });
}

// Função para exibir imagem principal existente
function showExistingMainImage(url) {
    const mainImageContainer = document.querySelector('.exibir-img-principal');
    mainImageContainer.innerHTML = '';  // Limpa a pré-visualização

    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("img-wrapper");

    const img = document.createElement("img");
    img.src = url;
    img.classList.add("img-principal");

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("btn-remove");
    removeBtn.type = "button-remove";
    removeBtn.innerHTML = 'Remover';

    removeBtn.addEventListener('click', function() {
        mainImageContainer.innerHTML = '';  // Remove a imagem da visualização
    });

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(removeBtn);
    mainImageContainer.appendChild(imgWrapper);
}

// Função para exibir imagens adicionais existentes
function showExistingAdditionalImages(urls) {
    const additionalImagesContainer = document.querySelector('.exibir-img-adicionais');
    additionalImagesContainer.innerHTML = '';  // Limpa a pré-visualização

    urls.forEach((url, index) => {
        const imgWrapper = document.createElement("div");
        imgWrapper.classList.add("img-wrapper");

        const img = document.createElement("img");
        img.src = url;
        img.classList.add("img-adicional");

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("btn-remove");
        removeBtn.type = "button-remove";
        removeBtn.innerHTML = 'Remover';

        removeBtn.addEventListener('click', function() {
            removedAdditionalImages.push(url);  // Armazena a URL da imagem removida na lista
            renderExistingAndNewImages();  // Re-renderiza imagens
        });

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(removeBtn);
        additionalImagesContainer.appendChild(imgWrapper);

        existingImagesList.push(url);  // Adiciona à lista de imagens existentes
    });
}

// Exibe novas imagens adicionadas pelo usuário
document.getElementById('imagens').addEventListener('change', function() {
    previewImages(this, 'additionalImagesDisplay');
});

function previewImages(input, previewContainerClass) {
    const previewContainer = document.querySelector(`.${previewContainerClass}`);
    let files = Array.from(input.files);

    if (!previewContainer.existingFiles) {
        previewContainer.existingFiles = [];
    }

    previewContainer.existingFiles = previewContainer.existingFiles.concat(files);
    additionalImagesList = previewContainer.existingFiles;
    files = additionalImagesList;

    renderExistingAndNewImages();
}

// Atualiza a visualização das imagens (novas e existentes)
function renderExistingAndNewImages() {
    const additionalImagesContainer = document.querySelector('.additionalImagesDisplay');
    additionalImagesContainer.innerHTML = '';
    showExistingAdditionalImages(existingImagesList);
    renderImageList(additionalImagesContainer, document.getElementById('imagens'), additionalImagesList);
}

// Função para renderizar novas imagens
function renderImageList(previewContainer, input, files) {
    previewContainer.innerHTML = "";

    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgWrapper = document.createElement("div");
            imgWrapper.classList.add("img-wrapper");

            const img = document.createElement("img");
            img.src = e.target.result;
            img.classList.add("additional-img");

            const removeBtn = document.createElement("button");
            removeBtn.classList.add("btn-remove");
            removeBtn.type = "button-remove";
            removeBtn.innerHTML = 'Remover';

            removeBtn.addEventListener('click', function() {
                files.splice(index, 1);
                updateFileInput(input, files);
                additionalImagesList = files;
                renderImageList(previewContainer, input, files);
            });

            imgWrapper.appendChild(img);
            imgWrapper.appendChild(removeBtn);
            previewContainer.appendChild(imgWrapper);
        };
        reader.readAsDataURL(file);
    });
}

// Atualiza o campo de input de arquivos
function updateFileInput(input, files) {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    input.files = dataTransfer.files;
}

// Exibe nova imagem principal selecionada
document.getElementById('imagemPrincipal').addEventListener('change', function() {
    previewMainImage(this, 'exibir-img-principal');
});

function previewMainImage(input, previewContainerClass) {
    const previewContainer = document.querySelector(`.${previewContainerClass}`);
    previewContainer.innerHTML = "";
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.classList.add("main-img");
            previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}

// Função para direcionar à listagem de produtos
function directToListagemProdutos() {
    window.location.href = "TelaListagemProdutoAdm.html";
}

// Função para obter o ID do produto da URL
function getProdutoIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}
