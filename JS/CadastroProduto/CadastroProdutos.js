let additionalImagesList = [];

document.getElementById('produtoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData();
    const produto = {
        nomeProduto: document.getElementById('nomeProduto').value,
        descricao: document.getElementById('descricao').value,
        preco: document.getElementById('preco').value,
        avaliacao: document.getElementById('avaliacao').value,
        quantidade: document.getElementById('quantidade').value,
        categoria: document.getElementById('categoria').value,
        marca: document.getElementById('marca').value
    };

    // Adiciona o JSON do produto com o Content-Type correto
    const produtoBlob = new Blob([JSON.stringify(produto)], { type: 'application/json' });
    formData.append('produto', produtoBlob);

    const imgPrincipalInput = document.querySelector("#imagemPrincipal");
    const imgPrincipal = imgPrincipalInput.files;

    // Verifica se o arquivo de imagem principal foi selecionado
    if (imgPrincipal.length === 0) {
        document.getElementById('response').innerText = 'Erro: Nenhuma imagem principal selecionada.';
        return;
    }
    // Adiciona a imagem principal
    formData.append('imagemPrincipal', imgPrincipal[0]);

    additionalImagesList.forEach(image => {
        formData.append('imagens', image);
    });

    try {
        console.log('Enviando requisição para a API...');
        const response = await fetch('http://' + API + ':8080/produto/cadastro', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar produto: ' + response.statusText);
        }

        const result = await response.json();
        console.log('Resposta da API:', result);

        document.getElementById('response').innerText = 'Produto cadastrado com sucesso!';
        console.log('Produto cadastrado com sucesso:', result);

        // Limpa os campos do formulário
        document.getElementById('produtoForm').reset();
        document.querySelector(".mainPicture__image").innerHTML = "Clique para escolher a imagem Principal:";
        document.querySelector(".additionalImagesDisplay").innerHTML = "";

        // Exibe o modal de confirmação
        showModal('Produto cadastrado com sucesso!');
    } catch (error) {
        document.getElementById('response').innerText = 'Erro ao cadastrar produto: ' + error.message;
        console.error('Erro ao cadastrar produto:', error);

        // Exibe o modal de erro
        showModal('Erro ao cadastrar produto: ' + error.message);
    }
});

document.getElementById('imagemPrincipal').addEventListener('change', function() {
    previewImage(this, 'mainPicture__image');
});

document.getElementById('imagens').addEventListener('change', function() {
    previewImages(this, 'additionalImagesDisplay');
});

document.getElementById('addImagesButton').addEventListener('click', function() {
    document.getElementById('imagens').click();
});

function previewImage(input, previewContainerClass) {
    const previewContainer = document.querySelector(`.${previewContainerClass}`);
    previewContainer.innerHTML = "";
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.classList.add("additional-img");
            previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}

function previewImages(input, previewContainerClass) {
    const previewContainer = document.querySelector(`.${previewContainerClass}`);
    let files = Array.from(input.files);

    // Se não houver uma lista existente, inicializamos
    if (!previewContainer.existingFiles) {
        previewContainer.existingFiles = [];
    }

    // Mescla as novas imagens com as existentes
    previewContainer.existingFiles = previewContainer.existingFiles.concat(files);
    additionalImagesList = previewContainer.existingFiles;  // Atualiza a lista global de imagens
    files = additionalImagesList;

    // Atualiza a exibição de imagens
    renderImageList(previewContainer, input, files);
}

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
            removeBtn.innerHTML = `
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
            `;

            removeBtn.addEventListener('click', function() {
                files.splice(index, 1);  // Remove o arquivo da lista
                updateFileInput(input, files);  // Atualiza o campo de entrada de arquivos
                additionalImagesList = files;  // Atualiza a lista de imagens globais
                renderImageList(previewContainer, input, files);  // Atualiza a pré-visualização
            });

            imgWrapper.appendChild(img);
            imgWrapper.appendChild(removeBtn);
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

function directToListagemProdutos() {
    window.location.href = "TelaListagemProdutoAdm.html";
}

function showModal(message) {
    const modal = document.getElementById('confirmationModal');
    const modalMessage = document.getElementById('modalMessage');
    const closeBtn = document.getElementsByClassName('close')[0];

    modalMessage.innerText = message;
    modal.style.display = 'block';

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}
