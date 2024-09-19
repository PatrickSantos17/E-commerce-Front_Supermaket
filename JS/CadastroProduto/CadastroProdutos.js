// URL da API
var API = "localhost"; // Altere para o IP da API quando subir para a nuvem

document.getElementById('addImagesButton').addEventListener('click', function() {
    document.getElementById('imagens').click();
});

// Função para pré-visualizar a imagem principal
document.getElementById("imagemPrincipal").addEventListener("change", function (e) {
    const inputTarget = e.target;
    const file = inputTarget.files[0];

    const mainPictureImage = document.querySelector(".mainPicture__image");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.classList.add("picture__img");
            mainPictureImage.innerHTML = "";  // Limpa o texto anterior
            mainPictureImage.appendChild(img); // Adiciona a imagem
        };
        reader.readAsDataURL(file);
    } else {
        mainPictureImage.innerHTML = "Clique para adicionar a imagem principal"; // Texto padrão quando não há imagem
    }
});

// Função para pré-visualizar múltiplas imagens adicionais
document.getElementById("imagens").addEventListener("change", function (e) {
    const files = e.target.files;
    const additionalImagesDisplay = document.querySelector(".additionalImagesDisplay");

    if (files.length > 0) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.classList.add("additional-img");
                additionalImagesDisplay.appendChild(img); // Adiciona a imagem na lista
            };
            reader.readAsDataURL(file);
        });
    }
});

// Função de envio do formulário
document.getElementById('produtoForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData();
    const produto = {
        nomeProduto: document.getElementById('nomeProduto').value,
        descricao: document.getElementById('descricao').value,
        preco: document.getElementById('preco').value,
        quantidade: document.getElementById('quantidade').value,
        categoria: document.getElementById('categoria').value,
        marca: document.getElementById('marca').value
    };

    // Adiciona o JSON do produto com o Content-Type correto
    const produtoBlob = new Blob([JSON.stringify(produto)], { type: 'application/json' });
    formData.append('produto', produtoBlob);

    // Adiciona a imagem principal
    const imgPrincipalInput = document.querySelector("#imagemPrincipal");
    const imgPrincipal = imgPrincipalInput.files;

    if (imgPrincipal.length === 0) {
        document.getElementById('response').innerText = 'Erro: Nenhuma imagem principal selecionada.';
        return;
    }
    formData.append('imagemPrincipal', imgPrincipal[0]);

    // Adiciona as imagens adicionais
    const imagens = document.getElementById('imagens').files;
    for (let i = 0; i < imagens.length; i++) {
        formData.append('imagens', imagens[i]);
    }

    try {
        console.log('Enviando requisição para a API...');
        const response = await fetch('http://' + API + ':8080/produto/cadastro', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar produto: ' + response.statusText);
        }

        // Limpa os campos do formulário
        document.getElementById('produtoForm').reset();
        document.querySelector(".mainPicture__image").innerHTML = "Escolha uma imagem";
        document.querySelector(".additionalImagesDisplay").innerHTML = "";
        document.querySelector('.imgsAdicionais__image').innerHTML = 'Escolha as imagens adicionais:'; // Restaura a mensagem

        // Exibe o modal de confirmação
        showModal('Produto cadastrado com sucesso!');
    } catch (error) {
        document.getElementById('response').innerText = 'Erro ao cadastrar produto: ' + error.message;
        console.error('Erro ao cadastrar produto:', error);

        // Exibe o modal de erro
        showModal('Erro ao cadastrar produto: ' + error.message);
    }
});

// Função para redirecionar à listagem de produtos
function directToListagemProdutos() {
    window.location.href = "TelaListagemProdutoAdm.html";
}

// Função para exibir o modal de confirmação/erro
function showModal(message) {
    const modal = document.getElementById('confirmationModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeBtn = document.getElementsByClassName('close')[0];

    modalMessage.innerText = message;
    modal.style.display = 'block';

    closeBtn.onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}