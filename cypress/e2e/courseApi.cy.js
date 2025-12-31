/// <reference types="cypress" />

it("UI login to API app", () => {
  //   cy.visit("https://conduit.bondaracademy.com/");
  //   cy.contains(" Sign in ").click();
  //   cy.get('[placeholder="Email"]').type("cypress555@mail.com");
  //   cy.get('[placeholder="Password"]').type("cypress555999");
  //   cy.contains("button", "Sign in").click()
  cy.loginToApiAppViaUI();
});

it("API login to API app", () => {
  //   // Login via API (without UI)
  //   cy.request({
  //     method: "POST",
  //     url: "https://conduit-api.bondaracademy.com/api/users/login",
  //     body: {
  //       user: {
  //         email: "cypress555@mail.com",
  //         password: "cypress555999",
  //       },
  //     },
  //   }).then((response) => {
  //     expect(response.status).to.eq(200);
  //     expect(response.body.user.token).to.exist;

  //     // Save token for other tests
  //     window.localStorage.setItem("jwtToken", response.body.user.token);
  //   });
  cy.loginToApiAppViaApi();
});

it("API intercept tags, articles", () => {
  // 1 variant
  cy.intercept("GET", "https://conduit-api.bondaracademy.com/api/tags", { fixture: "tags.json" });
  // 2 variant
  cy.intercept({ method: "GET", url: "https://conduit-api.bondaracademy.com/api/tags" }, { fixture: "tags.json" });

  cy.intercept("GET", "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0", { fixture: "articles.json" });
  cy.loginToApiAppViaUI();
});

it("Modify API response, likes number", () => {
  cy.intercept("GET", "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0", (req) => {
    req.continue((res) => {
      res.body.articles[0].favoritesCount = 999999999;
      res.send(res.body);
    });
  });
  cy.loginToApiAppViaUI();
  cy.get("app-favorite-button").first().should("have.text", " 999999999 ");
  cy.get("app-favorite-button").first().should("contain.text", "99999");
});
