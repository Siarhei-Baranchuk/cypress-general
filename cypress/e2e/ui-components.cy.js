/// <reference types="cypress" />

beforeEach("Open test application", () => {
  cy.visit("https://playground.bondaracademy.com/");
});

it("Input fields", () => {
  cy.contains("Forms").click();
  cy.contains("Form Layouts").click();

  cy.get("#inputEmail1").type("hello@test.com", { delay: 200 }).clear().type("+Name+Name");

  cy.get("#inputEmail1").clear().type("hello");

  const name = "Siarhei";
  cy.get("#inputEmail1").type("hello@test.com", { delay: 200 }).clear().type("hello").clear();
  cy.contains("nb-card", "Using the Grid").contains("Email").type(`${name}@test.com`);

  cy.get("#inputEmail1").should("not.have.value", "").clear().type("test@bondaracademy.com").press(Cypress.Keyboard.Keys.TAB);

  cy.contains("Auth").click();
  cy.contains("Login").click();

  cy.get("#input-email").type("test@bondaracademy.com");
  cy.get("#input-password").type("Welcome{enter}");
});

it("Radio buttons", () => {
  cy.contains("Forms").click();
  cy.contains("Form Layouts").click();

  cy.contains("nb-card", "Using the Grid")
    .find("[type='radio']")
    .then((allRadioButtons) => {
      cy.wrap(allRadioButtons).eq(0).check({ force: true }).should("be.checked");
      cy.wrap(allRadioButtons).eq(1).check({ force: true });
      cy.wrap(allRadioButtons).eq(0).should("not.be.checked");
      cy.wrap(allRadioButtons).eq(2).should("be.disabled");
    });

  cy.contains("nb-card", "Using the Grid").contains("label", "Option 1").find("input").check({ force: true });
});

it("Checkboxes", () => {
  cy.contains("Modal & Overlays").click();
  cy.contains("Toastr").click();

  cy.get("[type='checkbox']").check({ force: true });
  cy.get("[type='checkbox']").should("be.checked");

  cy.get("[type='checkbox']").uncheck({ force: true });
  cy.get("[type='checkbox']").should("not.be.checked");
});

it("Lists and Dropdowns", () => {
  cy.contains("Modal & Overlays").click();
  cy.contains("Toastr").click();

  // browser native dropdown
  cy.contains("div", "Toast type:").find("select").select("info");
  cy.contains("div", "Toast type:").find("select").should("have.value", "info");

  // custom dropdown
  cy.contains("div", "Position:").find("nb-select").click();
  cy.get(".option-list").contains("bottom-right").click();
  cy.contains("div", "Position:").find("nb-select").should("have.text", "bottom-right");

  cy.contains("div", "Position:")
    .find("nb-select")
    .then((dropdown) => {
      cy.wrap(dropdown).click();

      cy.get(".option-list nb-option").each((option, index, list) => {
        cy.wrap(option).click();
        if (index < list.length - 1) {
          cy.wrap(dropdown).click();
        }
        cy.wait(500);
      });
    });
});

it("Tooltips", () => {
  cy.contains("Modal & Overlays").click();
  cy.contains("Tooltip").click();

  cy.contains("button", "Top").trigger("mouseenter");
  cy.get("nb-tooltip").should("have.text", "This is a tooltip");
});

it("Dialog boxes", () => {
  cy.contains("Tables & Data").click();
  cy.contains("Smart Table").click();

  // 1.
  cy.get(".nb-trash").first().click();
  cy.on("window:confirm", (confirm) => {
    expect(confirm).to.equal("Are you sure you want to delete?");
  });

  // 2.
  cy.window().then((win) => {
    cy.stub(win, "confirm").as("dialogBox").returns(false);
  });
  cy.get(".nb-trash").first().click();
  cy.get("@dialogBox").should("be.calledWith", "Are you sure you want to delete?");
});

it("Web Tables", () => {
  cy.contains("Tables & Data").click();
  cy.contains("Smart Table").click();

  // 1 find by text
  cy.get("tbody")
    .contains("tr", "Larry")
    .then((tableRow) => {
      cy.wrap(tableRow).find(".nb-edit").click();
      cy.wrap(tableRow).find('[placeholder="Age"]').clear().type("25");
      cy.wrap(tableRow).find(".nb-checkmark").click();
      cy.wrap(tableRow).find("td").last().should("have.text", "25");
    });

  // 2 find by index
  cy.get(".nb-plus").click();
  cy.get("thead tr")
    .eq(2)
    .then((tableRow) => {
      cy.wrap(tableRow).find('[placeholder="First Name"]').type("John");
      cy.wrap(tableRow).find('[placeholder="Last Name"]').type("Smith");
      cy.wrap(tableRow).find('[placeholder="Username"]').type("Username555");
      cy.wrap(tableRow).find(".nb-checkmark").click();
    });

  cy.get("tbody tr")
    .first()
    .find("td")
    .then((tableColumns) => {
      cy.wrap(tableColumns).eq(2).should("have.text", "John");
      cy.wrap(tableColumns).eq(3).should("have.text", "Smith");
      cy.wrap(tableColumns).eq(4).should("have.text", "Username555");
    });

  // 3. Looping throught the rows
  cy.get("thead").find('[placeholder="Age"]').type(20);
  cy.wait(500);
  cy.get("tbody tr").each((tableRows) => {
    cy.wrap(tableRows).find("td").last().should("have.text", "20");
  });

  // 4. Looping throught the rows with array
  const ages = [20, 30, 40, 200];
  cy.wrap(ages).each((age) => {
    cy.get("thead").find('[placeholder="Age"]').clear().type(age);
    cy.wait(500);

    cy.get("tbody tr").each((tableRows) => {
      if (age == 200) {
        cy.wrap(tableRows).find("td").should("contain.text", "No data found");
      } else {
        cy.wrap(tableRows).find("td").last().should("have.text", age);
      }
    });
  });
});

it("Date Picker", () => {
  cy.contains("Forms").click();
  cy.contains("Datepicker").click();

  // 1 test, just one date
  cy.get('[placeholder="Form Picker"]').then((input) => {
    cy.wrap(input).click();
    cy.get(".day-cell").not(".bounding-month").contains("30").click();
    cy.wrap(input).should("have.value", "Dec 30, 2025");
  });

  // 2 test, + several days
  let date = new Date();
  date.setDate(date.getDate() + 8);
  let futureDate = date.getDate();
  let futureMonthShort = date.toLocaleString("en-US", { month: "short" });
  let futureMonthLong = date.toLocaleString("en-US", { month: "long" });
  let futureYear = date.getFullYear();
  let dateToAssert = `${futureMonthShort} ${futureDate}, ${futureYear}`;

  cy.get('[placeholder="Form Picker"]').then((input) => {
    cy.wrap(input).click();
    cy.get(".day-cell").not(".bounding-month").contains(futureDate).click();
    cy.wrap(input).should("have.value", dateToAssert);
  });

  // 3 test, next month
  let date2 = new Date();
  date2.setDate(date2.getDate() + 35);
  let futureDate2 = date2.getDate();
  let futureMonthShort2 = date2.toLocaleString("en-US", { month: "short" });
  let futureMonthLong2 = date2.toLocaleString("en-US", { month: "long" });
  let futureYear2 = date2.getFullYear();
  let dateToAssert2 = `${futureMonthShort2} ${futureDate2}, ${futureYear2}`;
  cy.get('[placeholder="Form Picker"]').then((input) => {
    cy.wrap(input).click();

    cy.get("nb-calendar-view-mode")
      .invoke("text")
      .then((calendarMonthsAndYear) => {
        if (!calendarMonthsAndYear.includes(futureMonthLong2) || !calendarMonthsAndYear.includes(futureYear2)) {
          cy.get('[data-name="chevron-right"]').click();
        }
      });

    cy.get(".day-cell").not(".bounding-month").contains(futureDate2).click();
    cy.wrap(input).should("have.value", dateToAssert2);
  });
});

it("Date Picker - with navigation function", () => {
  cy.contains("Forms").click();
  cy.contains("Datepicker").click();

  function selectDateFromCurrentDay(day) {
    let date = new Date();
    date.setDate(date.getDate() + day);
    let futureDay = date.getDate();
    let futureMonthLong = date.toLocaleDateString("en-US", { month: "long" });
    let futureMonthShort = date.toLocaleDateString("en-US", { month: "short" });
    let futureYear = date.getFullYear();
    let dateToAssert = `${futureMonthShort} ${futureDay}, ${futureYear}`;

    cy.get("nb-calendar-view-mode")
      .invoke("text")
      .then((calendarMonthAndYear) => {
        if (!calendarMonthAndYear.includes(futureMonthLong) || !calendarMonthAndYear.includes(futureYear)) {
          cy.get('[data-name="chevron-right"]').click();
          selectDateFromCurrentDay(day);
        } else {
          cy.get(".day-cell").not(".bounding-month").contains(futureDay).click();
        }
      });
    return dateToAssert;
  }

  cy.get('[placeholder="Form Picker"]').then((input) => {
    cy.wrap(input).click();
    const dateToAssert = selectDateFromCurrentDay(200);
    cy.wrap(input).should("have.value", dateToAssert);
  });
});

it("sliders", () => {
  cy.get('[tabtitle="Temperature"] circle').invoke("attr", "cx", "38.66").invoke("attr", "cy", "57.75").click();
  cy.get('[class="value temperature h1"]').should("contain.text", "18");
});

it("Drag and Drop", () => {
  cy.contains("Extra Components").click();
  cy.contains("Drag & Drop").click();

  cy.get("#todo-list div").first().trigger("dragstart");
  cy.get("#drop-list").trigger("drop");
});

it("Iframes", () => {
  cy.contains("Modal & Overlays").click();
  cy.contains("Dialog").click();

  // Wait for iframe to load
  cy.frameLoaded('[data-cy="esc-close-iframe"]');

  // Access iframe and interact with elements inside
  cy.iframe('[data-cy="esc-close-iframe"]').contains("Open Dialog with esc close").click();

  // Verify something inside iframe
  cy.contains("This is a title passed to the dialog component").should("exist");
  cy.get("button").contains("Dismiss Dialog").click();

  cy.contains("This is a title passed to the dialog component").should("not.exist");

  cy.enter('[data-cy="esc-close-iframe"]').then((getBody) => {
    getBody().contains("Open Dialog with esc close").click();
    cy.get("button").contains("Dismiss Dialog").click();
    getBody().contains("Open Dialog without esc close").click();
    cy.contains("OK").click();
  });
});
