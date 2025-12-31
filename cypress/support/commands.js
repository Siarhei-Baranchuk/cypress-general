// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("openHomePage", () => {
  cy.visit("https://playground.bondaracademy.com/");
});

Cypress.Commands.add("loginToApiAppViaUI", (email, password) => {
  cy.visit("https://conduit.bondaracademy.com/");
  cy.contains(" Sign in ").click();
  cy.get('[placeholder="Email"]').type(email || "cypress555@mail.com");
  cy.get('[placeholder="Password"]').type(password || "cypress555999");
  cy.contains("button", "Sign in").click();
});

Cypress.Commands.add("loginToApiAppViaApi", (email, password) => {
  cy.request({
    method: "POST",
    url: "https://conduit-api.bondaracademy.com/api/users/login",
    body: {
      user: {
        email: email || "cypress555@mail.com",
        password: password || "cypress555999",
      },
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body.user.token).to.exist;

    // Save token for other tests
    window.localStorage.setItem("jwtToken", response.body.user.token);
  });
});
