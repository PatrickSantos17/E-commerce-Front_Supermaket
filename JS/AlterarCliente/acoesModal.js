document.addEventListener('DOMContentLoaded', () => {
    const modalEndereco = document.querySelector('#cartao-endereco');
    const closeBtns = document.querySelectorAll('.close');
    const cancelarBtns = document.querySelectorAll('.cancelar');
    const btnAdicionarEndereco = document.querySelector('#adicionarEndereco');

    function limparCampos() {
        const inputs = document.querySelectorAll('#cartao-endereco input');
        // Seleciona todos os inputs dentro do modal
        inputs.forEach(input => {
            input.value = ""; // Limpa o valor de cada input
            input.classList.remove('is-invalid'); // Remove a classe de validação 'is-invalid'
            input.classList.remove('is-valid');
        });

        const feedbacks = document.querySelectorAll('.invalid-feedback');
        feedbacks.forEach(feedback => {
            feedback.style.display = 'none'; // Esconde todas as mensagens de feedback
        });
    }

    function openModalEndereco() {
        modalEndereco.style.display = 'flex';
    }

    function closeModalEndereco() {
        modalEndereco.style.display = 'none';
        limparCampos();
    };

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModalEndereco();
        });
    });

    cancelarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModalEndereco();
        });
    });

    // Adiciona o evento de clique para abrir o modal
    btnAdicionarEndereco.addEventListener('click', () => {
        openModalEndereco();
    });
});
