/// <reference types="cypress" />

beforeEach("Open test application", () => {
  cy.visit("/");
  cy.contains("Forms").click();
  cy.contains("Form Layouts").click();
});

it("Locators", () => {
  //by Tag
  cy.get("input"); // get find the first element match

  //by ID value
  cy.get("#inputEmail1");

  // by Class value
  cy.get(".input-full-width");

  // by attribute
  cy.get("[fullwidth]");

  // by attribute with value
  cy.get('[placeholder="Email"]');

  // by entire class value
  cy.get('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]');

  //how to combine several attributes
  cy.get('[placeholder="Email"][fullwidth]');
  cy.get('input[placeholder="Email"]');

  //find by data-cy attribute
  cy.get('[data-cy="inputEmail1"]');
});

it.only("Cypress Locator Methods", () => {
  // cy.get('selector') - to find elments on the page globally
  //find() - to find only child elements
  // cy.contains('text') - to find web elements by text

  cy.contains("Sign in"); // find the first element match
  cy.contains('[status="warning"]', "Sign in");
  cy.contains("nb-card", "Horizontal form").find("button");
  cy.contains("nb-card", "Horizontal form").contains("Sign in");
  cy.contains("nb-card", "Horizontal form").get("button");
});
