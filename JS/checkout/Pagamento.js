let isAutenticado = localStorage.getItem("autenticadoCliente");
const resumoPedido = JSON.parse(localStorage.getItem("resumoPedido"));
var formaPagamento = "";

document.addEventListener('DOMContentLoaded', function () {
    if (isAutenticado === "true") {
        let cartaoCreditoRadio = document.getElementById("cartao_credito");
        let pixRadio = document.getElementById("radio-pix");

        cartaoCreditoRadio.addEventListener('change', () => {
            if (cartaoCreditoRadio.checked) {
                formaPagamento = "Cartão de Crédito";
                const divCartao = document.querySelector('.container-pagamento');
                const divPix = document.querySelector('.container-pix');
                divPix.style.display = 'none';
                divCartao.style.display = 'flex';
                divCartao.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        pixRadio.addEventListener('change', () => {
            if (pixRadio.checked) {
                formaPagamento = "PIX";
                const divCartao = document.querySelector('.container-pagamento');
                const divPix = document.querySelector('.container-pix');
                divCartao.style.display = 'none';
                divPix.style.display = 'flex';
                divPix.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        })

        const inputsCartao = document.querySelectorAll(".formulario input");
        const descricaoInputInvalido = document.querySelectorAll(".formulario span");

        function verificarPagamentoSelecionado() {
            if (cartaoCreditoRadio.checked || pixRadio.checked) {
                inputsCartao.forEach(function (input) {
                    input.disabled = false;
                });
            }
        }
        verificarPagamentoSelecionado();
        cartaoCreditoRadio.addEventListener('change', verificarPagamentoSelecionado);
        pixRadio.addEventListener('change', verificarPagamentoSelecionado);

        isCartaoValidado(inputsCartao, descricaoInputInvalido, null);
        //buscar o endereço selecionado para entrega do pedido
        // let endereco = document.getElementById("endereco-entrega");

        // const enderecoEntrega = localStorage.getItem('endereco-entrega-pedido');
        // const enderecoConvertido = JSON.parse(enderecoEntrega);

        // endereco.innerHTML = ` <p>${enderecoConvertido.logradouro + ', ' + enderecoConvertido.numero}</p> `
        acessarCarrinhoProduto();
    } else {
        alert("Você precisa estar logado para acessar esta página!");
        window.location.href = 'TelaLoginCliente.html'
    }
});

function acessarCarrinhoProduto() {
    console.log(resumoPedido)
    document.getElementById("subtotal-produtos").textContent = resumoPedido.subtotal;
    document.getElementById("frete-pedido").textContent = resumoPedido.frete;
    document.getElementById("total-carrinho").textContent = resumoPedido.total;
}


function directResumoPedido() {
    localStorage.setItem("formaPagamento", formaPagamento);
    window.location.href = 'TelaResumoPedido.html';
}

// Aplicar blur e mostrar modal de pagamento-------------------------------------
function mostrarProcessamentoPagamento() {
    document.querySelector(".add-blur").classList.add('blur');
    // Exibe o modal de pagamento
    let processingModal = document.getElementById("container-modal");
    processingModal.style.display = "flex";
    // aplicando animação do modal
    setTimeout(function () {
        processingModal.classList.add("animate-modal");
        // atraso de 2 segundos, após animação do modal redireciona para a pagina
    }, 2000); // Atraso de 3 segundos (2000 milissegundos) para mostrar o modal em sua forma original
}

function esconderLoading() {
    document.querySelector(".add-blur").classList.remove('blur');
    processingModal.style.display = "none";
}

function fecharModal() {
    document.querySelector(".add-blur").classList.remove('blur');
    document.querySelector(".card-validacao").style.display = "none";
}

// validar os campos antes de gravar o pedido------------------------------------
function validarCampos(event) {
    event.preventDefault();

    let cartaoCreditoRadio = document.getElementById("cartao_credito");
    let pixRadio = document.getElementById("pix");

    let blurConteudoPrincipal = document.querySelector(".add-blur");
    let modalAlerta = document.querySelector(".card-validacao");

    if (!cartaoCreditoRadio.checked && !pixRadio.checked) {
        blurConteudoPrincipal.classList.add('blur');
        modalAlerta.style.display = "flex";
    } else if (cartaoCreditoRadio.checked || pixRadio.checked) {
        const inputsCartao = document.querySelectorAll(".formulario input");
        const descricaoInputInvalido = document.querySelectorAll(".formulario span");

        const cartaoValidado = isCartaoValidado(inputsCartao, descricaoInputInvalido, event);
        console.log("cartao validado: " + cartaoValidado);
        if (cartaoValidado) { //grava o pedido após validação do cartão
            directResumoPedido();
        }
    }
}

function isCartaoValidado(inputs, descricaoInputsInvalidos, event) {
    //array de validação para cada input
    let validacoes = Array(inputs.length).fill(false);
    // Define o comprimento mínimo e máximo para cada input
    const lengthInputs = [19, 7, 0, 3];
    const descricao = descricaoInputsInvalidos;

    let todosValidados = false;

    // Função para verificar se todos os elementos do vetor são true (todos campos validados)
    const verificarValidacoes = () => validacoes.every(validacao => validacao);

    inputs.forEach((input, index) => {
        if (event != null) { //event comprova que a validação foi ativada diretamente pelo botão de finalizar compra
            atualizarValidacao(input, descricao[index], validacoes, index, lengthInputs[index]);
            console.log(validacoes);
            todosValidados = verificarValidacoes();
        }
        input.addEventListener('input', function () { //validação ativada ao digitar informações nos inputs
            atualizarValidacao(input, descricao[index], validacoes, index, lengthInputs[index]);
        });
    });
    return todosValidados;
}

function atualizarValidacao(input, descricao, validacoes, index, comprimento) {

    let length = input.value.length;

    // Verifica se os campos estão preenchidos corretamente
    if (index != 2) {
        if (length >= comprimento) {
            validacoes[index] = true;
            input.classList.remove('input-invalido');
            input.classList.add('input-valido');
            descricao.style.display = "none";
            document.querySelector(".dados").style.marginBottom = '10px';
        } else {
            validacoes[index] = false;
            input.classList.remove('input-valido');
            input.classList.add('input-invalido');
            document.querySelector(".dados").style.marginBottom = '0';
            descricao.style.display = "flex";
        }
    } else { // faz a validação do campo nome separadamente, pois este campo não tem um limite de caracteres
        if (input.value.trim() === "") { //verifica se o campo nome esta sem nenhum texto
            validacoes[index] = false;
            input.classList.remove('input-valido');
            input.classList.add('input-invalido');
            document.querySelector(".dados").style.marginBottom = '0';
            descricao.style.display = "flex";
        } else {
            validacoes[index] = true;
            input.classList.remove('input-invalido');
            input.classList.add('input-valido');
            descricao.style.display = "none";
            document.querySelector(".dados").style.marginBottom = '10px';
        }
    }

    // Mostra o estado atual de validação de todos os campos
    // console.log(validacoes);
}

