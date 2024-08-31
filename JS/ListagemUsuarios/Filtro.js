  function filtrarUsuarios() {
    // Obtém o valor digitado no campo de entrada
    var filtro = document.getElementById('filtro').value.toUpperCase();
    // Obtém a lista de todos os usuarios
    var usuarios = document.querySelectorAll('.user');

    // Itera sobre cada usuario na lista
    for (var i = 0; i < usuarios.length; i++) {
      var usuario = usuarios[i];
      var textoUsuarios = usuario.querySelector('.text_usuarios').innerText.toUpperCase();
      if (textoUsuarios.indexOf(filtro) > -1) {
        // Se corresponder, mostra o usuario
        usuario.style.display = "";
      } else {
        // Caso contrário, esconde o usuario
        usuario.style.display = "none";
      }
    }
  }

