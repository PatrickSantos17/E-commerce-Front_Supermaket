function filtrarUsuarios() {
  // Obtém o valor digitado no campo de entrada
  var filtro = document.getElementById('filtro').value.toUpperCase();
  
  // Obtém todas as linhas da tabela dentro do <tbody>
  var linhas = document.querySelectorAll("tbody tr");
  
  // Itera sobre cada linha da tabela
  linhas.forEach(linha => {
      // Obtém o texto da célula que contém o nome do usuário (supondo que esteja na primeira célula <td>)
      var nomeUsuario = linha.querySelector("td:first-child").innerText.toUpperCase();

      // Verifica se o nome do usuário contém o filtro digitado
      if (nomeUsuario.includes(filtro)) {
          linha.style.display = ""; // Mostra a linha
      } else {
          linha.style.display = "none"; // Esconde a linha
      }
  });
}
