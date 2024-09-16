//Pega as informações do html
const formulario = document.querySelector("form");
const Inome = document.querySelector("#nomeProduto");
const Ipreco = document.querySelector("#preco");
const Icategoria = document.querySelector("#categoria");
const Imarca = document.querySelector("#marca");
const Itamanho = document.querySelector("#tamanho");
const Iunidade = document.querySelector("#unidade");
const Iestoque = document.querySelector("#estoque");
const Idescricao = document.querySelector("#descricao");

const Iimagem = document.querySelector("#picture__input");
const Iimagem2 = document.querySelector("#picture__input2");
const Iimagem3 = document.querySelector("#picture__input3");
const Iimagem4 = document.querySelector("#picture__input4");

// Vetor para armazenar os dados de tamanho e estoque
let dados = [];

// Função para adicionar os valores ao vetor e atualizar a textarea
function adicionarNaLista() {
    const tamanho = Itamanho.value.trim();
    const estoque = Iestoque.value.trim();

    if (tamanho && estoque) {
        // Adiciona os dados ao vetor
        dados.push({ tamanho, estoque });

        // Atualiza a textarea com os valores do vetor
        atualizarTextarea();

        // // Limpa os campos após adicionar à lista
        Itamanho.value = '';
        Iestoque.value = '';
    } else {
        alert('Por favor, preencha os campos de tamanho e estoque.');
    }
}

// Função para atualizar a textarea com os valores do vetor
function atualizarTextarea() {
    // Monta a string com os valores do vetor
    const texto = dados.map(item => `Tamanho: ${item.tamanho}, Estoque: ${item.estoque}`).join('\n');

    // Atualiza a textarea com a string
    document.getElementById('textarea-tam-est').value = texto;
}

// Função para excluir o último registro do vetor dados e atualizar a textarea
function excluirUltimoRegistro() {
    // Verifica se há elementos no vetor
    if (dados.length > 0) {
        // Remove o último elemento do vetor
        dados.pop();
        // Atualiza a textarea com os valores atualizados do vetor
        atualizarTextarea();
    } else {
        alert('Não há registros para excluir.');
    }
}

function cadastrar() {
    //Instância da classe que guardará a imagem
    const formData = new FormData();

    //Objeto JSON que recebe os dados que serão guardados no banco
    const produto = {
        nome: Inome.value,
        preco: Ipreco.value.replace(/,/g, '.'),
        categoria: Icategoria.value,
        marca: Imarca.value,
        tamanhosEstoque: dados,
        unidade: Iunidade.value,
        descricao: Idescricao.value
    };

    //Adição das info dos produtos no objeto
    formData.append('produto', JSON.stringify(produto));

    //Adição das imagens no objeto
    formData.append('imagem', Iimagem.files[0]);
    formData.append('imagem2', Iimagem2.files[0]);
    formData.append('imagem3', Iimagem3.files[0]);
    formData.append('imagem4', Iimagem4.files[0]);

    mostrarLoading();
    //Conexão com o backend para gravação do JSON
    const request1 = fetch('http://localhost:8080/api/produtos/cadastrarProd', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                setTimeout(() => {
                    esconderLoading();
                    document.querySelector(".card").style.display = "flex";
                }, 3000);
            } else {
                alert("Erro ao cadastrar produto");
                document.querySelector(".main").classList.remove('blur');
                document.querySelector("footer").classList.remove('blur');
                esconderLoading();
            }
        })
        .catch(error => {
            alert("Erro ao cadastrar produto");
            esconderLoading();
            document.querySelector(".main").classList.remove('blur');
            document.querySelector("footer").classList.remove('blur');
        });
}

function limpar() {
    Inome.value = "";
    Icategoria.value = "";
    Ipreco.value = "";
    dados = [];

    // Reseta o formulário
    formulario.reset();

    // Remove a pré-visualização das imagens
    pictureImage.innerHTML = pictureImageTxt;
    pictureImage2.innerHTML = pictureImageTxt;
    pictureImage3.innerHTML = pictureImageTxt;
    pictureImage4.innerHTML = pictureImageTxt;
}

//EventListener que captura o momento que o botão cadastrar é pressionado
document.querySelector('.btn-cadastrar').addEventListener('click', function (event) {
    event.preventDefault();
    cadastrar();
    limpar();
});

// Adiciona um evento de clique ao botão "Inserir"
document.querySelector('.btn-incluir').addEventListener('click', function (event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário
    adicionarNaLista(); // Chama a função para adicionar na lista
});

document.querySelector('.btn-excluir').addEventListener('click', function (event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário
    excluirUltimoRegistro(); // Chama a função para adicionar na lista
});