/// <reference types="cypress" />

beforeEach("Open test application", () => {
  cy.visit("/");
  cy.contains("Forms").click();
  cy.contains("Form Layouts").click();
});

it("Assertions", () => {
  // https://docs.cypress.io/app/core-concepts/introduction-to-cypress#Implicit-Assertions
  // https://docs.cypress.io/app/references/assertions

  cy.get('[for="exampleInputEmail1"]').should("have.text", "Email address");

  cy.get('[for="exampleInputEmail1"]').then((label) => {
    expect(label).to.have.text("Email address");
  });

  cy.get('[for="exampleInputEmail1"]')
    .invoke("text")
    .then((emailLabel) => {
      expect(emailLabel).to.equal("Email address");
      cy.wrap(emailLabel).should("equal", "Email address");
    });
});

it("Timeouts", () => {
  // https://docs.cypress.io/app/references/configuration#Timeouts
  cy.contains("Modal & Overlays").click();
  cy.contains("Dialog").click();

  cy.contains("Open with delay 10 seconds").click();
  cy.get("nb-dialog-container nb-card-header", { timeout: 11000 }).should("have.text", "Friendly reminder");
});
