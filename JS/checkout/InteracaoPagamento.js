function redirecionarParaPagina(pagina) {
    window.location.href = pagina;

    window.history.replaceState(null, null, pagina);
}

function formatarNumeroCartao(valor) {
    // Remover todos os espaços existentes no valor
    valor = valor.replace(/\D/g, '');
    
    // Adicionar um espaço após cada conjunto de 4 dígitos
    let valorFormatado = valor.replace(/(\d{4})/g, '$1 ').trim();
    
    // Atualizar o valor do input com a formatação
    document.getElementById("num-cartao").value = valorFormatado;
    
    // Atualizar o conteúdo da tag "p" com a formatação
    document.getElementById("valorNumCartao").textContent = valorFormatado;
}

function permitirSomenteNumeros(event) {
    // Verificar se a tecla pressionada é um número (0-9)
    let charCode = event.charCode ? event.charCode : event.keyCode;
    if (charCode < 48 || charCode > 57) {
        event.preventDefault();
    }
}

function formatarValidade(valor) {
    // Remover todos os caracteres não numéricos
    valor = valor.replace(/\D/g, '');

    // Adicionar uma barra após os dois primeiros dígitos
    if (valor.length > 2) {
        valor = valor.substring(0, 2) + ' / ' + valor.substring(2);
    }

    // Atualizar o valor do input com a formatação
    document.getElementById("validade").value = valor;

    // Atualizar o conteúdo da tag "p" com a formatação
    document.getElementById("valorValidade").textContent = valor;
}

function formatarNomeCartao(valor) {
     // Remover todos os caracteres que não são letras, espaços, caracteres acentuados ou til
    //  valor = valor.replace(/[^a-zA-ZÀ-ÿ\s~]/g, '');

     // Atualizar o valor do input com a formatação
    document.getElementById("nome").value = valor;

    // Atualizar o conteúdo da tag "p" com a formatação
    document.getElementById("valorNome").textContent = valor;
}

function permitirSomenteLetras(event) {
    // Permitir apenas letras (A-Z, a-z), caracteres acentuados, espaço e til
    let charCode = event.charCode || event.keyCode;
    let char = String.fromCharCode(charCode);

    // Permitir: letras, espaço, acentos, til e teclas de controle
    let regex = /^[a-zA-ZÀ-ÿ\s~]$/;
    if (
        regex.test(char) || // Letras e caracteres acentuados e til
        charCode === 8 || // Backspace
        charCode === 9 || // Tab
        charCode === 13 || // Enter
        charCode === 37 || // Seta para a esquerda
        charCode === 39 || // Seta para a direita
        charCode === 46 // Delete
    ) {
        return; // Permitir a entrada
    } else {
        event.preventDefault(); // Bloquear a entrada
    }
}

// Aplica uma mascara no valor do CVV--------------------------------------------------------------------
function atualizarCVVMascarado(idParagrafo, valor) {
    let valorMascarado = "*".repeat(valor.length);
    document.getElementById(idParagrafo).textContent = valorMascarado;
}

// Gira o cartão ao digitar o CVV
function verificarCVV(value) {
    let card = document.getElementById("card");
    if (value.trim().length > 0) {
        card.classList.add("virar");
    } else {
        card.classList.remove("virar");
    }
}

// Executa as funções ref ao CVV
function inputCVVHandler(value) {
    verificarCVV(value);
    atualizarCVVMascarado('valorCVV', value);
}


