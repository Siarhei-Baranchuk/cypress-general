/// <reference types="cypress" />

beforeEach("Open test application", () => {
  cy.visit("/");
  cy.contains("Forms").click();
  cy.contains("Form Layouts").click();
});

it("Child Elements", () => {
  // cy.contains('text') - to find web elements by text
  // cy.contains('text').find() - to find only child elements

  cy.contains("nb-card", "Using the Grid").find(".row").find("button");

  cy.get("nb-card").find("nb-radio-group").contains("Option 1");

  cy.get("nb-card nb-radio-group").contains("Option 1");
});

it("Parent Elements", () => {
  // .parents() - to find all parent elements matching the selector
  // .parent() - to find direct parent element only

  cy.get("#inputEmail1").parents("form").find("button");

  cy.contains("Using the Grid").parent().find("button");
});

it("Cypress Chains", () => {
  // example, not good way to use chaining after actions like click()
  cy.get("#inputEmail1").parents("form").find("button").click();

  cy.get("#inputEmail1").parents("form").find("nb-radio").first().should("have.text", "Option 1");
});
