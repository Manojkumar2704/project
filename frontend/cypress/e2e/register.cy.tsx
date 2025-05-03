describe('Registration Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('should show validation errors when submitting empty form', () => {
    cy.get('button[type="submit"]').click();

    cy.contains('Name is required');
    cy.contains('Email is invalid');
    cy.contains('Password must be at least 6 characters');
  });
  

  it('should register with valid input and redirect', () => {
    const random = Math.floor(Math.random() * 10000);
    const email = `testuser${random}@example.com`;

    cy.get('input[name="userName"]').type('Test User');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type('password123');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('button[type="submit"]').click();

    cy.get('@alert').should('have.been.calledWith', 'User registered successfully');
    cy.url().should('include', '/login');
  });
});
