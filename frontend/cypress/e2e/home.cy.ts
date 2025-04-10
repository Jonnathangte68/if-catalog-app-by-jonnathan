describe('Products Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads and displays product cards', () => {
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
  });

  it('filters products by search input using real product text', () => {
    cy.visit('/');
  
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
    cy.get('[data-testid="product-card"]')
      .first()
      .invoke('text')
      .then((text) => {
        const words = text.trim().split(/\s+/);
        const keyword = words.find((w) => w.length > 3) || words[0];
        cy.log(`Using keyword: ${keyword}`);

        cy.get('input[placeholder*="Search"]').clear().type(keyword);

        cy.wait(400);
  
        cy.get('[data-testid="product-card"]')
          .should('have.length.greaterThan', 0)
          .each(($el) => {
            cy.wrap($el).invoke('text').should('match', new RegExp(keyword, 'i'));
          });
      });
  });  

  it('handles backend failure and recovers on retry', () => {

    cy.intercept('GET', /\/products$/i, {
      statusCode: 500,
      body: { message: 'fail' },
    }).as('failFirst');
  
    cy.visit('/');
    cy.wait('@failFirst');
  
    cy.contains('Something went wrong').should('exist');
    cy.get('[data-testid="error-message"]').should('be.visible');
  
    cy.intercept('GET', /\/products$/i, {
      fixture: 'products.json',
      statusCode: 200,
    }).as('recover');
  
    cy.get('button').contains('Retry').click();
    cy.wait('@recover');
  
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
  });  

  it('toggles dark mode', () => {
    cy.get('html').should('not.have.class', 'dark');
    cy.get('button[aria-label="Toggle Dark Mode"]').click();
    cy.get('html').should('have.class', 'dark');
  });
});
