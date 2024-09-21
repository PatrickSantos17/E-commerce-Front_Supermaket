function acessarProduto(produtoId) {
    fetch('http://' + API + ':8080/produto/consultar/' + produtoId)
        .then(response => response.json())
        .then(produto => {
            document.getElementById('productName').value = produto.nome;
            document.getElementById('productDescription').value = produto.descricao;
            document.getElementById('productPrice').value = produto.preco;
            document.getElementById('productQuantity').value = produto.quantidade;
            document.getElementById('productBrand').value = produto.marca;
            document.getElementById('productCategory').value = produto.categoria;
            // Exibir a imagem principal se disponível
            if (produto.imagemPrincipal) {
                const mainImageDisplay = document.querySelector('.mainImageDisplay');
                mainImageDisplay.innerHTML = '';
                const img = document.createElement('img');
                img.src = 'http://' + API + ':8080/' + produto.imagemPrincipal;
                img.style.maxWidth = '100%';
                mainImageDisplay.appendChild(img);
            }
            // Exibir imagens adicionais se disponíveis
            if (produto.imagensAdicionais && produto.imagensAdicionais.length > 0) {
                const additionalImagesDisplay = document.querySelector('.additionalImagesDisplay');
                additionalImagesDisplay.innerHTML = '';
                produto.imagensAdicionais.forEach(imagem => {
                    const img = document.createElement('img');
                    img.src = 'http://' + API + ':8080/' + imagem;
                    img.style.maxWidth = '100px';
                    img.style.marginRight = '10px';
                    additionalImagesDisplay.appendChild(img);
                });
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

// Event listener para carregar o produto ao carregar a página
document.addEventListener('DOMContentLoaded', (event) => {
    const produtoId = getProdutoIdFromURL(); // Supondo que você tenha uma função para obter o ID do produto da URL
    if (produtoId) {
        acessarProduto(produtoId);
    }

    const modal = document.getElementById("alterationModal");
    const span = document.getElementsByClassName("close")[0];

    // Quando o usuário clica em <span> (x), fecha o modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Quando o usuário clica fora do modal, fecha o modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Exibir imagem principal selecionada
    document.getElementById('imagemPrincipal').addEventListener('change', function(event) {
        const mainImageDisplay = document.querySelector('.mainImageDisplay');
        mainImageDisplay.innerHTML = '';
        const file = event.target.files[0];
        if (file) {
            displayImage(file, mainImageDisplay, '100%');
        }
    });

    // Exibir imagens adicionais selecionadas
    document.getElementById('imagens').addEventListener('change', function(event) {
        const additionalImagesDisplay = document.querySelector('.additionalImagesDisplay');
        additionalImagesDisplay.innerHTML = '';
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            displayImage(file, additionalImagesDisplay, '100px');
        }
    });
});

// Função para exibir uma imagem
function displayImage(file, displayElement, maxWidth) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = "Imagem do produto";
        img.style.maxWidth = maxWidth;
        displayElement.appendChild(img);
    };
    reader.onerror = function(error) {
        console.error("Erro ao ler o arquivo:", error);
    };
    reader.readAsDataURL(file);
}

// Supondo que você tenha uma função para obter o ID do produto da URL
function getProdutoIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('produtoId');
}