describe('404 error handling', () => {
  it('fails when the event id is invalid', () => {
    cy.request({ url: '/events/lkdjflksdfjsd', failOnStatusCode: false }).then(
      (response) => {
        expect(response.status).to.eq(404);
      }
    );
  });
});
