describe('Events Page', () => {
  it('loads successfully and displays events', () => {
    cy.visit('/events');
    cy.contains('Upcoming events').should('exist');
    cy.get('input[name="name"]').should('exist');
    cy.get('.events-grid').should('exist');
    cy.get('.event-card').then(($eventCards) => {
      if ($eventCards.length > 0) {
        cy.get('.event-card').should('exist');
      } else {
        cy.contains('There are no upcoming events at the moment').should(
          'exist'
        );
      }
    });
  });
});
