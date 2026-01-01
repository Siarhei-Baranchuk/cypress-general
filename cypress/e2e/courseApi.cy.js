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
  // 1 variant - short syntax
  cy.intercept("GET", "https://conduit-api.bondaracademy.com/api/tags", { fixture: "tags.json" });
  // 2 variant - object syntax
  cy.intercept({ method: "GET", url: "https://conduit-api.bondaracademy.com/api/tags" }, { fixture: "tags.json" });

  // Mock articles with fixture data
  cy.intercept("GET", "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0", { fixture: "articles.json" });
  cy.loginToApiAppViaUI();
});

it("Modify API response, likes number", () => {
  // Intercept and modify real API response dynamically
  cy.intercept("GET", "https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0", (req) => {
    req.continue((res) => {
      // Change likes count to test edge case
      res.body.articles[0].favoritesCount = 999999999;
      res.send(res.body);
    });
  });
  cy.loginToApiAppViaUI();

  // Verify modified value appears in UI
  cy.get("app-favorite-button").first().should("have.text", " 999999999 ");
  cy.get("app-favorite-button").first().should("contain.text", "99999");
});

it("Waiting for APIs", () => {
  // Intercept API request and create alias
  cy.intercept("GET", "https://conduit-api.bondaracademy.com/api/articles*").as("getArticles");

  cy.loginToApiAppViaUI();

  // Wait for API to complete before checking
  cy.wait("@getArticles").then((apiArticleObject) => {
    console.log(apiArticleObject);
    expect(apiArticleObject.response.body.articles[0].title).to.contain("Bondar Academy");
  });

  cy.get("app-article-list")
    .invoke("text")
    .then((allArticleTexts) => {
      expect(allArticleTexts).to.contain("Bondar Academy");
    });
});

it.only("Create/Delete article E2E", () => {
  // Generate unique article title with timestamp
  const articleTitle = "Article Title " + Date.now();

  // Step 1: Login and get access token
  cy.request({
    url: "https://conduit-api.bondaracademy.com/api/users/login",
    method: "POST",
    body: {
      user: {
        email: "useremail45645654@mail.com",
        password: "username45645654",
      },
    },
  }).then((response) => {
    expect(response.status).to.equal(200);
    const accessToken = "Token " + response.body.user.token;

    // Step 2: Create new article with auth token
    cy.request({
      url: "https://conduit-api.bondaracademy.com/api/articles/",
      method: "POST",
      headers: { Authorization: accessToken },
      body: {
        article: {
          title: articleTitle,
          description: "Article Description",
          body: "Article body",
          tagList: ["QA", "Automation", "Cypress"],
        },
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.article.title).to.equal(articleTitle);
      const slugId = response.body.article.slug;

      // Step 3: Verify article exists by getting it directly by slug
      cy.request({
        url: `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
        method: "GET",
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.article.title).to.eq(articleTitle);
        expect(response.body.article.slug).to.eq(slugId);
      });

      // Step 4: Delete the created article
      cy.request({
        url: `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
        method: "DELETE",
        headers: { Authorization: accessToken },
      }).then((response) => {
        expect(response.status).to.equal(204);
      });

      // Step 5: Verify article was deleted (should return 404)
      cy.request({
        url: `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
        method: "GET",
        headers: { Authorization: accessToken },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("errors");
        expect(response.body.errors.article).to.contain("not found");
      });
    });
  });
});

it.only("Create/Delete article E2E with Custom Command", () => {
  // Generate unique article title with timestamp
  const articleTitle = "Article Title " + Date.now();

  // Step 1: Login using custom command
  cy.loginToApiAppViaApi("useremail45645654@mail.com", "username45645654");

  // Step 2: Get token from localStorage and create article
  cy.window().then((window) => {
    const accessToken = "Token " + window.localStorage.getItem("jwtToken");

    cy.request({
      url: "https://conduit-api.bondaracademy.com/api/articles/",
      method: "POST",
      headers: { Authorization: accessToken },
      body: {
        article: {
          title: articleTitle,
          description: "Article Description",
          body: "Article body",
          tagList: ["QA", "Automation", "Cypress"],
        },
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.article.title).to.equal(articleTitle);
      const slugId = response.body.article.slug;

      // Step 3: Verify article exists by getting it directly by slug
      cy.request({
        url: `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
        method: "GET",
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.article.title).to.eq(articleTitle);
        expect(response.body.article.slug).to.eq(slugId);
      });

      // Step 4: Delete the created article
      cy.request({
        url: `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
        method: "DELETE",
        headers: { Authorization: accessToken },
      }).then((response) => {
        expect(response.status).to.equal(204);
      });

      // Step 5: Verify article was deleted (should return 404)
      cy.request({
        url: `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
        method: "GET",
        headers: { Authorization: accessToken },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property("errors");
        expect(response.body.errors.article).to.contain("not found");
      });
    });
  });
});
