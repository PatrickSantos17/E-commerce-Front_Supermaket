describe('Login Test', () => {
    it('should log in successfully with valid credentials', () => {
        // Visita a página de login
        cy.visit('TelaLogin.html'); // Altere a URL conforme necessário

        // Insere o nome de usuário
        cy.get('input[placeholder="Digite seu E-mail"]').type('lucas@teste.com'); // Altere o valor conforme necessário

        // Insere a senha
        cy.get('input[type="password"]').type('12345'); // Altere o seletor e o valor conforme necessário

        // Clica no botão de login
        cy.get('button[type="submit"]').click(); // Altere o seletor conforme necessário

        // Verifica se o modal de sucesso aparece e está visível
        cy.get('.cartao .modal-dados-pessoais .message').should('be.visible').and('contain.text', 'Login Realizado com sucesso!');
    });
});