// var API = "4.228.231.177"; // Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; // Setar essa variavel quando testar local e comentar a do IP

var grupoUsuarioLogado = localStorage.getItem("grupo");
var removedAdditionalImages = [];  // Para armazenar as URLs das imagens adicionais removidas
var existingImages = [];  // Lista para armazenar URLs das imagens existentes
var newImages = [];  // Lista para armazenar os novos arquivos de imagem
var combinedArray = [];

document.addEventListener('DOMContentLoaded', (event) => {
    if (grupoUsuarioLogado === "Admin") {
        const produtoId = getProdutoIdFromURL();
        if (produtoId) {
            acessarProduto(produtoId);
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
                document.querySelector('.input-alterar-principal').disabled = true;
                document.getElementById('imagens').disabled = true;
                document.getElementById('addImagesButton').disabled = true;

                // Habilitar botões de salvar e cancelar e o campo de quantidade
                document.getElementById('btn-alterar').disabled = false;
                document.getElementById('btn-cancelar').disabled = false;
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

    alterarBtn.addEventListener('click', function (event) {
        event.preventDefault();  // Previne a ação padrão do botão
        inputFile.click();  // Abre o gerenciador de arquivos
    });

    inputFile.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
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

    previewImages(null, 'img-grid');
}

document.getElementById('imagens').addEventListener('change', function () {
    const additionalImagesContainer = document.querySelector('.exibir-img-adicionais');
    additionalImagesContainer.innerHTML = '';  // Limpa a pré-visualização

    additionalImagesContainer.innerHTML = `
        <label>Imagens adicionais:</label>
        <div class="img-grid"></div>
    `;
    previewImages(this, 'img-grid');
});

function previewImages(input, previewContainerClass) {
    const previewContainer = document.querySelector(`.${previewContainerClass}`);
    let files = null;
    // Se houver arquivos de input, adicione-os ao array de novas imagens
    if (input) {
        files = Array.from(input.files);
        // Se não houver uma lista existente, inicializamos
        if (!previewContainer.existingFiles) {
            previewContainer.existingFiles = [];
        }

        // Mescla as novas imagens com as existentes
        previewContainer.existingFiles = previewContainer.existingFiles.concat(files);
        newImages = previewContainer.existingFiles;
        files = newImages;
    }

    combinedArray = [...existingImages, ...newImages]; // Combina os arrays de URLs existentes e arquivos novos
    previewContainer.innerHTML = '';  // Limpa a pré-visualização

    // Renderiza cada imagem no array combinado
    combinedArray.forEach((image, combinedIndex) => {
        let imagem, arrayType, originalIndex;

        // Verifica se é uma URL (imagem existente) ou um arquivo (imagem nova)
        if (typeof image === 'string') {
            // Se for uma URL (existingImages)
            imagem = image;
            arrayType = 'existing';  // Marca como sendo do array de URLs
            originalIndex = existingImages.indexOf(image); // Pega o índice original no array existingImages
        } else {
            // Se for um arquivo (newImages)
            imagem = URL.createObjectURL(image);
            arrayType = 'new';  // Marca como sendo do array de arquivos
            originalIndex = newImages.indexOf(image); // Pega o índice original no array newImages
        }

        // Cria a estrutura HTML para a imagem e o botão de remoção
        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('img-wrapper');

        imgWrapper.innerHTML = `
            <img src="${imagem}" class="img-principal">
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
        removeBtn.addEventListener('click', function (event) {
            event.preventDefault();

            if (arrayType === 'existing') {
                removedAdditionalImages.push(existingImages[originalIndex]);
                existingImages.splice(originalIndex, 1);
            } else {
                files.splice(originalIndex, 1);
                updateFileInput(input);
                newImages = files;
            }

            previewImages(input, previewContainerClass);
        });

        previewContainer.appendChild(imgWrapper);
    });
}

// Função para atualizar o campo de input de arquivos
function updateFileInput(input) {
    input.value = '';
}

// Adiciona evento ao botão "Escolha novas imagens adicionais"
document.getElementById('addImagesButton').addEventListener('click', function () {
    document.getElementById('imagens').click();
});

document.getElementById('btn-alterar').addEventListener('click', function (event) {
    event.preventDefault();
    const produtoId = getProdutoIdFromURL();
    const formData = new FormData();

    const produto = {
        id: produtoId,
        nomeProduto: document.getElementById('nomeProduto').value,
        descricao: document.getElementById('descricao').value,
        preco: document.getElementById('preco').value,
        avaliacao: document.getElementById('avaliacao').value,
        quantidade: document.getElementById('quantidade').value,
        categoria: document.getElementById('categoria').value,
        marca: document.getElementById('marca').value,
        urlImagensExcluidas: removedAdditionalImages
    };

    // Adiciona o JSON do produto com o Content-Type correto
    const produtoBlob = new Blob([JSON.stringify(produto)], { type: 'application/json' });
    formData.append('produto', produtoBlob);

    const imgPrincipalInput = document.querySelector(".input-alterar-principal");
    const imgPrincipal = imgPrincipalInput.files;

    if (!(imgPrincipal.length === 0)) {
        formData.append('imagemPrincipal', imgPrincipal[0]);
    }

    console.log(newImages)
    console.log(newImages.length)
    if (!(newImages.length === 0)) {
        newImages.forEach(image => {
            formData.append('imagensNovas', image);
        });
    }

    if (produtoId) {
        alterarProduto(formData);
    } else {
        alert("Não foi possível identificar o produto, volte a tela de listagem e tente novamente!")
    }
})

function alterarProduto(formData) {
    mostrarLoading();
    fetch('http://' + API + ':8080/produto/alterar', {
        method: 'PUT',
        body: formData
    })
        .then(response => {
            if (response.status === 200) {
                setTimeout(() => {
                    esconderLoading();
                    document.querySelector(".card").style.display = "flex";
                }, 3000);
            } else if (response.status === 400) {
                alert("Avaliação deve estar entre 1 e 5 e variar de 0,5 em 0,5!");
                document.querySelector(".container").classList.remove('blur');
                esconderLoading();
            } else {
                alert("Erro ao alterar produto. Por favor, tente novamente.");
                document.querySelector(".container").classList.remove('blur');
                esconderLoading();
            }
        })
        .catch(error => {
            console.error('Erro ao alterar produto:', error);
            alert("Erro ao alterar produto. Por favor, tente novamente.");
            esconderLoading();
            document.querySelector(".container").classList.remove('blur');
        });
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
