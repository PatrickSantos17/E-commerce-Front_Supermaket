// var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

document.getElementById('produtoForm').addEventListener('submit', async function(event) {
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

    const imgPrincipalInput = document.querySelector("#imagemPrincipal");
    const imgPrincipal = imgPrincipalInput.files;

    // Verifica se o arquivo de imagem principal foi selecionado
    if (imgPrincipal.length === 0) {
        document.getElementById('response').innerText = 'Erro: Nenhuma imagem principal selecionada.';
        return;
    }
    // Adiciona a imagem principal
    formData.append('imagemPrincipal', imgPrincipal[0]);

    // Adiciona as imagens adicionais
    const imagens = document.getElementById('imagens').files;
    for (let i = 0; i < imagens.length; i++) {
        formData.append('imagens', imagens[i]);
    }

    try {
        const response = await fetch('http://' + API + ':8080/produto/cadastro', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        document.getElementById('response').innerText = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('response').innerText = 'Erro ao cadastrar produto: ' + error.message;
    }
});

function directToListagemProdutos() {
    window.location.href = "TelaListagemProdutoAdm.html";
}