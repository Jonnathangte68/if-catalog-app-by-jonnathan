describe('Demo Page', () => {
    it('shows If-branded page', () => {
      cy.visit('/demo');
      cy.contains('Hello If World').should('exist');
    });
  });
   