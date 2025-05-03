

describe('Login Page', () => {
    Cypress.on('uncaught:exception', () => false);
  
    beforeEach(() => {
      cy.visit('http://localhost:3000/login');
    });
    it('should show validation error on empty form submission', () => {
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="error-message"]').should('contain', 'User not found');
      cy.url().should('include', '/login');
    });
  
    it('should show error for invalid credentials', () => {
      cy.intercept('POST', `http://localhost:7000/user/login`, {
        statusCode: 401,
        body: {
          message: 'Invalid credentials',
        },
      }).as('loginRequest');
  
      cy.get('input[name="email"]').type('wrong@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest');
  
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials');
    });
  
    it('should login successfully and redirect to /home', () => {
      cy.intercept('POST', 'http://localhost:7000/user/login', {
        statusCode: 201,
        body: {
          token: 'fake-jwt-token',
        },
      }).as('loginRequest');

      cy.visit('http://localhost:3000/login');
  
      cy.get('input[name="email"]').type('manoj@example.com');
      cy.get('input[name="password"]').type('password123');

      cy.window().then((win) => {
        cy.stub(win.localStorage, 'setItem').as('setItem');
      });
  
      cy.get('button[type="submit"]').click();
  
      cy.wait('@loginRequest');
 

  
      cy.url().should('include', '/home');
    });
  });
  