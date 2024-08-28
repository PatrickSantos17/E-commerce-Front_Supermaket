// Dados para adicionar à tabela
const data = [
    { name: 'João', age: 25, city: 'São Paulo' },
    { name: 'Maria', age: 30, city: 'Rio de Janeiro' },
    { name: 'Pedro', age: 22, city: 'Belo Horizonte' },
];

// Função para adicionar dados à tabela
function populateTable() {
    const tableBody = document.querySelector('#myTable tbody');

    data.forEach(item => {
        const row = document.createElement('tr');

        const cellName = document.createElement('td');
        cellName.textContent = item.name;
        row.appendChild(cellName);

        const cellAge = document.createElement('td');
        cellAge.textContent = item.age;
        row.appendChild(cellAge);

        const cellCity = document.createElement('td');
        cellCity.textContent = item.city;
        row.appendChild(cellCity);

        tableBody.appendChild(row);
    });
}

// Chama a função para preencher a tabela ao carregar a página
window.onload = populateTable;

function directToListagem() {
    window.location.href = "TelaFormularioCliente.html"
}