var API = "4.228.231.177"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
// var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

document.addEventListener("DOMContentLoaded", () => {
    fetchUsuarios();
});

async function fetchUsuarios() {
    try {
        // Substitua o URL abaixo pela URL da sua API
        const response = await fetch("http://"+API+":8080/usuario");
        const usuarios = await response.json();

        // Chama a função que preenche a tabela
        preencherTabela(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
    }
}

function preencherTabela(usuarios) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // Limpa o conteúdo da tabela antes de adicionar novos dados

    usuarios.forEach(usuario => {
        const tr = document.createElement("tr");

        const ativo = usuario.ativo ? "Ativo" : "Inativo";
        // Preenche as células com os dados do usuário
        tr.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.credencialId.email}</td>
            <td>${ativo}</td>
            <td>${usuario.grupo}</td>
            <td class="acao">
                <button onclick="alterarUsuario(${usuario.id})">Alterar</button>
            </td>
            <td class="acao">
                <button onclick="habilitarDesabilitarUsuario(${usuario.id}, '${ativo}')">${ativo === 'Ativo' ? 'Desabilitar' : 'Habilitar'}</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function alterarUsuario(id) {
    // Função para redirecionar para a página de alteração do usuário
    window.location.href = `TelaAlterarUsuario.html?id=${id}`;
}

async function habilitarDesabilitarUsuario(id, ativo) {
    const endpoint = ativo === 'Ativo' ? `http://`+API+`:8080/usuario/desativar/${id}` : `http://`+API+`:8080/usuario/ativar/${id}`;
    try {
        const response = await fetch(endpoint, {
            method: 'PATCH'
        });

        if (response.status === 200) {
            alert(`Usuário ${ativo === 'Ativo' ? 'desabilitado' : 'ativado'} com sucesso!`);
            fetchUsuarios();
        } else {
            alert("Erro ao tentar atualizar o status do usuário. Por favor, tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao atualizar status do usuário:", error);
        alert("Ocorreu um erro inesperado. Por favor, tente novamente.");
    }
}

function directToCadastro() {
    window.location.href = "TelaFormularioCliente.html"
}
