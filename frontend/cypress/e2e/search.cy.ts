describe('Search Functionality', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('shows the search input', () => {
      cy.get('input[placeholder*="Search"]').should('exist');
    });
  
    it('filters products by title or description', () => {
      cy.visit('/');
      cy.get('input[placeholder*="Search"]').type('mascara');
    
      cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
    
      cy.get('[data-testid="product-card"]').then(($cards) => {
        const matching = [...$cards].filter((el) =>
          el.innerText.toLowerCase().includes('mascara')
        );
    
        expect(matching.length).to.be.greaterThan(0);
      });
    });    
  
    it('shows no results for invalid query', () => {
      cy.get('input[placeholder*="Search"]').type('zzzzzzzz');
      cy.get('[data-testid="product-card"]').should('have.length', 0);
    });
  });
  