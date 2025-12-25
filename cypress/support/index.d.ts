declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to open the home page.
     * @example cy.openHomePage()
     */
    openHomePage(): Chainable<void>;
  }
}
