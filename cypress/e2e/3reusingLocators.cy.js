/// <reference types="cypress" />

beforeEach("Open test application", () => {
  cy.visit("/");
  cy.contains("Forms").click();
  cy.contains("Form Layouts").click();
});

it("Reusing Locators", () => {
  //THIS WILL NOT WORK!!! DON"T DO LIKE THIS!!!
  //const inputEmail1 = cy.get('#inputEmail1')
  //inputEmail1.parents('form').find('button')
  //inputEmail1.parents('form').find('nb-radio')

  // 1. Cypress Alias
  cy.get("#inputEmail1").as("inputEmail1");
  cy.get("@inputEmail1").parents("form").find("button");
  cy.get("@inputEmail1").parents("form").find("nb-radio");

  // 2. Cypress then() method
  cy.get("#inputEmail1").then((inputEmail) => {
    cy.wrap(inputEmail).parents("form").find("button");
    cy.wrap(inputEmail).parents("form").find("nb-radio");
    cy.wrap("Hello").should("equal", "Hello");
    cy.wrap(inputEmail).as("inputEmail2");
  });

  cy.get("@inputEmail2").click();
});
