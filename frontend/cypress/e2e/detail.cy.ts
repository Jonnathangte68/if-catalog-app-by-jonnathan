describe('Product Detail Page', () => {
    it('navigates to detail page and displays correct product info', () => {
      cy.visit('/');
      cy.get('[data-testid="product-card"]')
        .first()
        .as('firstCard');
  
      cy.get('@firstCard').click();

      cy.url().should('include', '/products/');

      cy.get('h2').should('exist');
      cy.contains('Back to products').should('exist');
      cy.get('div').contains('€').should('exist');
    });
  
    it('shows not found message for invalid product id', () => {
      cy.visit('/products/nonexistent-id');
      cy.contains('Product not found.').should('exist');
      cy.contains('Back to products').should('exist');
    });
  });
  