function filtrarProdutos() {
    // Obtém o valor digitado no campo de entrada
    var filtro = document.getElementById('filtro').value.toUpperCase();
    
    // Obtém todas as linhas da tabela dentro do <tbody>
    var linhas = document.querySelectorAll("tbody tr");
    
    // Itera sobre cada linha da tabela
    linhas.forEach(linha => {
        // Obtém o texto da célula que contém o nome do produto (supondo que esteja na terceira célula <td>)
        var nomeProduto = linha.querySelector("td:nth-child(3)").innerText.toUpperCase();

        // Verifica se o nome do produto contém o filtro digitado
        if (nomeProduto.includes(filtro)) {
            linha.style.display = ""; // Mostra a linha
        } else {
            linha.style.display = "none"; // Esconde a linha
        }
    });
}