class RegisterForm {
  elements = {
    emailInput: () => cy.get('.email'),
    senhaInput: () => cy.get('.senha'),
    btnLogin: () => cy.get('.btn-login'),
    modalCredencialInvalida: () => cy.get('.invalido .modal-dados-pessoais .message'),
    modalCredencialValida: () => cy.get('.cartao .modal-dados-pessoais .message'),
    btnOkModal: () => cy.get('#clicked'),
  }

  typeEmail(text) {
    if (!text) return;
    this.elements.emailInput().type(text)
  }

  typeSenha(senha) {
    if (!senha) return;
    this.elements.senhaInput().type(senha)
  }
}

const registerForm = new RegisterForm()
describe('Teste login com a senha errada inicialmente e correção depois', () => {
  describe('Preenchendo o login com senha incorreta', () => {
    const input = {
      email: 'lucas@teste.com',
      senha: '123456',
    }

    it('Dado que eu acesso a tela de login', () => {
      cy.visit('TelaLogin.html');
    })

    it(`Quando eu digito "${input.email}" no email`, () => {
      registerForm.typeEmail(input.email)
    })

    it(`Então eu digito a senha no campo da senha`, () => {
      registerForm.typeSenha(input.senha)
    })

    it('Então eu clico no botão de login', () => {
      registerForm.elements.btnLogin().click();
    })

    it('Então eu deveria ver "Usuário/senha inválido!" em um modal', () => {
      registerForm.elements.modalCredencialInvalida().should('contain.text', 'Usuário/senha inválido!')
    })
  })

  describe('Preenchendo o login com senha correta após preencher com a senha errada', () => {

    const input = {
      email: 'lucas@teste.com',
      senha: '12345',
    }

    after(() => {
      cy.clearLocalStorage()
    })

    it('Dado que eu clico em ok para fechar o modal', () => {
      registerForm.elements.btnOkModal().click();
    })

    it('Quando eu apago a senha errada', () => {
      registerForm.elements.senhaInput().clear();
    })

    it(`Então eu digito a senha correta no campo da senha`, () => {
      registerForm.typeSenha(input.senha)
    })

    it('Então eu clico no botão de login', () => {
      registerForm.elements.btnLogin().click();
    })

    it('Então eu deveria ver "Login Realizado com sucesso!" em um modal', () => {
      registerForm.elements.modalCredencialValida().should('be.visible').and('contain.text', 'Login Realizado com sucesso!');
    })
  });
});