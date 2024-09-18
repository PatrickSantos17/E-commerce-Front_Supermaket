// var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

function filtrarProdutos() {
    // Obtém o valor digitado no campo de entrada
    var filtro = document.getElementById('filtro').value.toUpperCase();
    
    async function fetchData(page = 0, nome) {
        try {
            const response = await fetch(`http://${API}:8080/produto/buscaNome?nome=${nome}&page=${page}`); // Substitua pela URL do seu backend
            const result = await response.json();
            data = result.produtos; // Armazena os produtos recebidos
            totalPages = result.totalPages; // Armazena o número total de páginas
            displayTableData();
            setupPagination();
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }
}