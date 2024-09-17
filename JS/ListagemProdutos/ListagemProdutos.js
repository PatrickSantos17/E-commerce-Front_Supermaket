// var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

var grupoUsuarioLogado = localStorage.getItem("grupo");

const rowsPerPage = 10;
let currentPage = 1;
let totalPages = 0;
let data = []; // Array para armazenar os dados dos produtos

async function fetchData(page = 0) {
    try {
        const response = await fetch(`http://${API}:8080/produto/listagem?page=${page}`); // Substitua pela URL do seu backend
        const result = await response.json();
        data = result.produtos; // Armazena os produtos recebidos
        totalPages = result.totalPages; // Armazena o número total de páginas
        displayTableData();
        setupPagination();
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

function displayTableData() {
    const tabela = document.querySelector('.divTable');

    if (grupoUsuarioLogado === "Admin") {
        tabela.innerHTML = `
        <table>
            <thead> 
                <tr>       
                    <th>Imagem</th>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Quantidade</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th class="acao">Alterar</th>
                    <th class="acao">Visualizar</th>
                    <th class="acao">Hab/Des</th>
                </tr>
            </thead>
            <tbody id="table-body">
            </tbody>
        </table>
                        `;
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td><img src="${item.urlImagemPrincipal}" alt="${item.nomeProduto}" width="50"></td>
            <td>${item.id}</td>
            <td>${item.nomeProduto}</td>
            <td>${item.quantidade}</td>
            <td>${item.preco}</td>
            <td>${item.ativo ? 'Ativo' : 'Inativo'}</td>
            <td class="acao"><button>Alterar</button></td>
            <td class="acao">
                <button onclick="visualizarProduto()">Visualizar</button>
            </td>
            <td class="acao"><button>Hab/Des</button></td>
        `;
            tableBody.appendChild(row);
        });
    } else if (grupoUsuarioLogado === "Estoquista") {
        tabela.innerHTML = `
        <table>
            <thead> 
                <tr>       
                    <th>Imagem</th>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Quantidade</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th class="acao">Alterar</th>
                </tr>
            </thead>
            <tbody id="table-body">
            </tbody>
        </table>
                        `;
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td><img src="${item.urlImagemPrincipal}" alt="${item.nomeProduto}" width="50"></td>
            <td>${item.id}</td>
            <td>${item.nomeProduto}</td>
            <td>${item.quantidade}</td>
            <td>${item.preco}</td>
            <td>${item.ativo ? 'Ativo' : 'Inativo'}</td>
            <td class="acao"><button>Alterar</button></td>
        `;
            tableBody.appendChild(row);
        });
    } else {
        alert("Você não tem permissão para acessar esta página!");
        window.location.href = 'TelaLogin.html';
    }
}

function setupPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('page-btn');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            fetchData(currentPage - 1); // Ajusta a página para a API (0-indexed)
        });
        pagination.appendChild(button);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchData(); // Carrega os dados do backend quando a página é carregada
});

function directToCadastroProdutos() {
    window.location.href = "TelaCadastroProduto.html";
}

function visualizarProduto() {
    abrirModalProduto();
}

function abrirModalProduto() {
    document.querySelector(".card-produto").style.display = "flex";
}

function fecharModalProduto() {
    document.querySelector(".card-produto").style.display = "none";
}