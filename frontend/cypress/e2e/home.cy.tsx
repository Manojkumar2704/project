describe('Home Page - Product Actions', () => {
    const testProduct = {
      _id: '1',
      name: 'Test Product',
      description: 'This is a test product',
      quantity: 10,
      image: ['https://example.com/image.jpg'],
      price: 99.99,
    };
  
    beforeEach(() => {
      cy.intercept('GET', '**/product/allproducts', {
        statusCode: 200,
        body: { result: [testProduct] },
      }).as('getProducts');
  
      cy.visit('http://localhost:3000/home');
      
  
      cy.get('[data-testid="product-table"]').should('exist');
      cy.get('[data-testid="product-row"]', { timeout: 10000 }).should('have.length', 1);
      cy.wait('@getProducts');
    });
  
    it('should delete a product successfully', () => {
      cy.intercept('DELETE', `**/product/deleteproduct/${testProduct._id}`, {
        statusCode: 200,
        body: {},
      }).as('deleteProduct');
  
      cy.get('[data-testid="product-row"]').within(() => {
        cy.get('[data-testid="delete-button"]').click();
      });
  
      cy.wait('@deleteProduct');
      cy.get('[data-testid="product-row"]').should('have.length', 0);
    });
  
    it('should navigate to the update page when edit is clicked', () => {
      cy.get('[data-testid="product-row"]').within(() => {
        cy.get('[data-testid="edit-button"]').click();
      });
  
      cy.url().should('include', `/update/${testProduct._id}`);
    });
  });
  