describe('Backend Failure & Recovery', () => {
  it('shows an error message when the backend is unavailable and recovers after retry', () => {
    cy.intercept('GET', '**/products', {
      statusCode: 500,
      body: { message: 'fail' },
    }).as('failProducts');

    cy.visit('/');
    cy.wait('@failProducts');

    cy.contains('Something went wrong').should('exist');
    cy.get('[data-testid="error-message"]').should('be.visible');

    cy.intercept('GET', '**/products', {
      fixture: 'products.json',
      statusCode: 200,
    }).as('getProducts');

    cy.get('button').contains('Retry').click();
    cy.wait('@getProducts');
    
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
  });
});
