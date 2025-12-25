/// <reference types="cypress" />

beforeEach("Open test application", () => {
  cy.visit("https://aqa-proka4.org/sandbox/web");
});

it("Input fields", () => {
  // Fill username field
  cy.get("#registrationForm").find("#username").type("Name");
  cy.get("#registrationForm").find("#username").should("have.value", "Name");

  // Fill remaining form fields
  cy.get("#registrationForm").find("#email").type("name@mail.com");
  cy.get("#registrationForm").find("#password").type("name@mail.com");
  cy.get("#registrationForm").find("#country").select("United States");
  cy.get("#terms").check();
  cy.get("#submitBtn").contains("Register").click();

  // Verify success message
  cy.get("#formResult").contains("Форма успешно отправлена!").should("be.visible");
  cy.get("#formResult").should("contain.text", "Форма успешно отправлена!");
});

it("Radio buttons", () => {
  // Select payment method
  cy.get("#paymentPaypal").check();
  cy.get("#paymentPaypal").should("be.checked");

  // Select plan
  cy.get('input[type="radio"]#planPro').check();
  cy.get("#planPro").should("be.checked");

  // Show results
  cy.get("#showRadioBtn").click();

  // Verify selected values
  cy.get("#radioResult").find("#selectedPayment").should("have.text", "PayPal");
  cy.get("#radioResult").find("#selectedPlan").should("have.text", "Pro ($29)");
});

it("Checkboxes", () => {
  // Check terms checkbox
  cy.get("#termsCheckbox").check();
  cy.get("#termsCheckbox").should("be.checked");

  // Select JavaScript skill
  cy.get(".mb-6").find("[value='JavaScript']").check();
  cy.get(".mb-6").find("[value='JavaScript']").should("be.checked");

  // Select Playwright skill
  cy.get(".mb-6").find("[value='Playwright']").check();
  cy.get(".mb-6").find("[value='Playwright']").should("be.checked");

  // Show results and verify
  cy.get("#showCheckboxBtn").click();
  cy.get("#selectedSkills").should("contain", "JavaScript, Playwright");
});

it("Dropdowns", () => {
  // Select country
  cy.get("#countrySelect").select("de");

  // Select automation tool
  cy.get("#automationTool").select("Cypress");

  // Select programming language
  cy.get("#languagesSelect").select("JavaScript");

  // Select experience level
  cy.get("#experienceSelect").select("senior");

  // Show results and verify all selections
  cy.get("#showSelectBtn").click();
  cy.get("#selectResultText").should("contain", "Страна: Германия");
  cy.get("#selectResultText").should("contain", "Инструмент: Cypress");
  cy.get("#selectResultText").should("contain", "Языки: JavaScript");
  cy.get("#selectResultText").should("contain", "Опыт: Senior (5+ лет)");
});

describe("Tooltips", () => {
  it("Basic tooltips", () => {
    cy.get("#tooltipBtn1").trigger("mouseenter");
    cy.get("#tooltip1").should("contain", "Это всплывающая подсказка!");

    cy.get("#tooltipBtn2").trigger("mouseenter");
    cy.get("#tooltip2").should("contain", "Я снизу!");
  });

  // METHOD 1: Using .within() - cleanest and most readable approach
  it("Hover menu - Method 1: .within()", () => {
    cy.get("#hoverMenu").trigger("mouseenter");
    cy.get("#hoverDropdown").should("be.visible");

    cy.get("#hoverDropdown").within(() => {
      // Check "Home" menu item
      cy.contains("Главная").should("be.visible");
      cy.contains("Главная").parent().find("i.fa-home").should("exist");

      // Check "Profile" menu item
      cy.contains("Профиль").should("be.visible");
      cy.contains("Профиль").parent().find("i.fa-user").should("exist");

      // Check "Settings" menu item
      cy.contains("Настройки").should("be.visible");
      cy.contains("Настройки").parent().find("i.fa-cog").should("exist");

      // Check "Logout" menu item
      cy.contains("Выход").should("be.visible");
      cy.contains("Выход").parent().find("i.fa-sign-out-alt").should("exist");
    });
  });

  // METHOD 2: Using .find() with .eq() - explicit parent and index-based
  it("Hover menu - Method 2: .find()", () => {
    cy.get("#hoverMenu").trigger("mouseenter");
    cy.get("#hoverDropdown").should("be.visible");

    // Verify there are exactly 4 menu items
    cy.get("#hoverDropdown").find("a").should("have.length", 4);

    // Validate each menu item by index
    cy.get("#hoverDropdown").find("a").eq(0).should("contain", "Главная");
    cy.get("#hoverDropdown").find("a").eq(0).find("i.fa-home").should("exist");

    cy.get("#hoverDropdown").find("a").eq(1).should("contain", "Профиль");
    cy.get("#hoverDropdown").find("a").eq(1).find("i.fa-user").should("exist");

    cy.get("#hoverDropdown").find("a").eq(2).should("contain", "Настройки");
    cy.get("#hoverDropdown").find("a").eq(2).find("i.fa-cog").should("exist");

    cy.get("#hoverDropdown").find("a").eq(3).should("contain", "Выход");
    cy.get("#hoverDropdown").find("a").eq(3).find("i.fa-sign-out-alt").should("exist");
  });

  // METHOD 3: Direct selector - most compact approach
  it("Hover menu - Method 3: Direct selector", () => {
    cy.get("#hoverMenu").trigger("mouseenter");
    cy.get("#hoverDropdown").should("be.visible");

    // Check menu items count
    cy.get("#hoverDropdown a").should("have.length", 4);

    // Validate text content
    cy.get("#hoverDropdown").contains("Главная").should("be.visible");
    cy.get("#hoverDropdown").contains("Профиль").should("be.visible");
    cy.get("#hoverDropdown").contains("Настройки").should("be.visible");
    cy.get("#hoverDropdown").contains("Выход").should("be.visible");

    // Validate icons
    cy.get("#hoverDropdown i.fa-home").should("exist");
    cy.get("#hoverDropdown i.fa-user").should("exist");
    cy.get("#hoverDropdown i.fa-cog").should("exist");
    cy.get("#hoverDropdown i.fa-sign-out-alt").should("exist");
  });

  // METHOD 4: Using aliases - for element reusability
  it("Hover menu - Method 4: Using alias", () => {
    cy.get("#hoverMenu").trigger("mouseenter");
    cy.get("#hoverDropdown").should("be.visible").as("dropdown");

    // Create aliases for all menu items
    cy.get("@dropdown").within(() => {
      cy.contains("Главная").as("homeLink");
      cy.contains("Профиль").as("profileLink");
      cy.contains("Настройки").as("settingsLink");
      cy.contains("Выход").as("logoutLink");
    });

    // Validate using aliases
    cy.get("@homeLink").should("be.visible").parent().find("i.fa-home").should("exist");
    cy.get("@profileLink").should("be.visible").parent().find("i.fa-user").should("exist");
    cy.get("@settingsLink").should("be.visible").parent().find("i.fa-cog").should("exist");
    cy.get("@logoutLink").should("be.visible").parent().find("i.fa-sign-out-alt").should("exist");
  });

  // METHOD 5: Iteration with .each() - data-driven approach for bulk validation
  it("Hover menu - Method 5: Iteration with .each()", () => {
    cy.get("#hoverMenu").trigger("mouseenter");
    cy.get("#hoverDropdown").should("be.visible");

    // Define expected menu structure
    const menuItems = [
      { text: "Главная", icon: "fa-home" },
      { text: "Профиль", icon: "fa-user" },
      { text: "Настройки", icon: "fa-cog" },
      { text: "Выход", icon: "fa-sign-out-alt" },
    ];

    // Iterate through all links and validate
    cy.get("#hoverDropdown a").each(($el, index) => {
      cy.wrap($el).should("contain", menuItems[index].text);
      cy.wrap($el).find(`i.${menuItems[index].icon}`).should("exist");
    });
  });
});

describe("Dialog boxes", () => {
  // METHOD 1: Using cy.stub() - replaces the function with a mock
  it("Alert - with cy.stub()", () => {
    // Replace alert function with stub
    cy.window().then((win) => {
      cy.stub(win, "alert").as("alertStub");
    });
    cy.contains("button", "Alert").click();
    cy.get("@alertStub").should("have.been.calledWith", "Это простой Alert!");
  });

  it("Confirm (OK) - with cy.stub()", () => {
    // Replace confirm function with stub that returns true (OK button)
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(true).as("confirmStub");
    });
    cy.contains("button", "Confirm").click();
    cy.get("@confirmStub").should("have.been.calledWith", "Вы уверены?");
  });

  it("Confirm (Cancel) - with cy.stub()", () => {
    // Replace confirm function with stub that returns false (Cancel button)
    cy.window().then((win) => {
      cy.stub(win, "confirm").returns(false).as("confirmCancelStub");
    });
    cy.contains("button", "Confirm").click();
    cy.get("@confirmCancelStub").should("have.been.calledWith", "Вы уверены?");
  });

  // METHOD 2: Using cy.on() - listens to dialog events
  it("Alert - with cy.on()", () => {
    // Setup event listener before triggering alert
    cy.on("window:alert", (alertText) => {
      expect(alertText).to.equal("Это простой Alert!");
    });
    cy.contains("button", "Alert").click();
  });

  it("Confirm (OK) - with cy.on()", () => {
    // Return true to simulate clicking OK
    cy.on("window:confirm", (confirmText) => {
      expect(confirmText).to.equal("Вы уверены?");
      return true;
    });
    cy.contains("button", "Confirm").click();
  });

  it("Confirm (Cancel) - with cy.on()", () => {
    // Return false to simulate clicking Cancel
    cy.on("window:confirm", (confirmText) => {
      expect(confirmText).to.equal("Вы уверены?");
      return false;
    });
    cy.contains("button", "Confirm").click();
  });
});

describe("Web Tables", () => {
  it("Filtered table by name", () => {
    // Filter by name
    cy.get("#filterInput").type("Charlie Adams");
    cy.get("tbody").contains("tr", "Adams").should("contain", "Charlie Adams");
    cy.get("tbody").contains("tr", "Adams").should("be.visible");
    cy.get("tbody").contains("tr", "Alice Cooper").should("not.be.visible");
  });

  it("Filtered table by status - validate only Active rows", () => {
    // Select Active status from dropdown
    cy.get("#statusFilter").select("Active");

    // Target only visible rows (without "hidden" class)
    cy.get("#filterableTableBody tr:not(.hidden)").should("have.length", 3);

    // Verify all visible rows have "Active" status
    cy.get("#filterableTableBody tr:not(.hidden)").each((row) => {
      cy.wrap(row).find("td").last().should("contain", "Active");
    });

    // Alternative: verify each row individually
    cy.get("#filterableTableBody tr:not(.hidden)").eq(0).should("contain", "Alice Cooper").and("contain", "Active");
    cy.get("#filterableTableBody tr:not(.hidden)").eq(1).should("contain", "Charlie Adams").and("contain", "Active");
    cy.get("#filterableTableBody tr:not(.hidden)").eq(2).should("contain", "Eve Martinez").and("contain", "Active");

    // Verify no visible rows contain Inactive or Pending status
    cy.get("#filterableTableBody tr:not(.hidden)").should("not.contain", "Inactive");
    cy.get("#filterableTableBody tr:not(.hidden)").should("not.contain", "Pending");
  });

  it("Filtered table by status - verify all statuses", () => {
    // Get all status badges and verify they are all "Active"
    cy.get("#statusFilter").select("Active");

    cy.get("#filterableTableBody tr:not(.hidden) td:last-child").each((statusCell) => {
      cy.wrap(statusCell).should("contain", "Active");
    });

    // Count Active badges
    cy.get("#filterableTableBody tr:not(.hidden) td:last-child").filter(':contains("Active")').should("have.length", 3);
  });

  it("Filtered table - simple for...of loop", () => {
    // Select Active status
    cy.get("#statusFilter").select("Active");

    // Get all visible rows (without "hidden" class) and use for...of loop
    cy.get("#filterableTableBody tr:not(.hidden)").then((rows) => {
      for (const row of rows) {
        // Wrap each row and validate status
        cy.wrap(row).find("td").last().should("contain", "Active");
      }
    });
  });
});

describe("Date Picker", () => {
  it("Select date and time", () => {
    // type date
    let selectedDate = "2025-12-05";
    cy.get("#datePicker").type(selectedDate);
    cy.get("#showDateBtn").click();
    cy.get("#selectedDate").should("contain", selectedDate);

    // type date and time
    let selectedDateTime = "2025-12-26T18:18";
    cy.get("#dateTimePicker").type(selectedDateTime);
    cy.get("#showDateBtn").click();
    cy.get("#selectedDate").should("contain", selectedDateTime);
  });
});

describe("Range Sliders", () => {
  it("Volume slider - set value using invoke", () => {
    // Set slider value to 50
    cy.get("#volumeSlider").invoke("val", 50).trigger("input");

    // Verify the displayed value is updated
    cy.get("#volumeValue").should("contain", "50");
  });

  it("Volume slider - set multiple values", () => {
    const values = [0, 25, 50, 75, 100];

    // 1 Test multiple values using forEach
    values.forEach((value) => {
      cy.get("#volumeSlider").invoke("val", value).trigger("input");
      cy.get("#volumeValue").should("contain", value.toString());
    });

    // 2 Test multiple values using for...of loop
    for (const value of values) {
      cy.get("#volumeSlider").invoke("val", value).trigger("input");
      cy.get("#volumeValue").should("contain", value.toString());
    }
  });

  it("Volume slider - verify min and max boundaries", () => {
    // Set to minimum
    cy.get("#volumeSlider").invoke("val", 0).trigger("input");
    cy.get("#volumeValue").should("contain", "0");

    // Set to maximum
    cy.get("#volumeSlider").invoke("val", 100).trigger("input");
    cy.get("#volumeValue").should("contain", "100");

    // Verify attributes
    cy.get("#volumeSlider").should("have.attr", "min", "0");
    cy.get("#volumeSlider").should("have.attr", "max", "100");
    cy.get("#volumeSlider").should("have.attr", "step", "1");
  });
});

describe("Drag & Drop", () => {
  // METHOD 1: Using plugin @4tw/cypress-drag-drop
  it("Simple Drag & Drop - using plugin", () => {
    // Drag item2 from available to selected items
    cy.get("#availableItems").find('[data-item="item2"]').drag("#selectedItems");

    // Verify item2 is now in selected items
    cy.get("#selectedItems").find('[data-item="item2"]').should("exist");
    cy.get("#selectedItems").should("contain", "Элемент 2");
  });

  // METHOD 2: Manual implementation with dataTransfer
  it("Simple Drag & Drop - manual with dataTransfer", () => {
    // Create a DataTransfer object for drag event
    const dataTransfer = new DataTransfer();

    // Drag item3 from available to selected items
    cy.get("#availableItems").find('[data-item="item3"]').trigger("dragstart", { dataTransfer });

    cy.get("#selectedItems")
      .trigger("dragenter", { dataTransfer })
      .trigger("dragover", { dataTransfer })
      .trigger("drop", { dataTransfer })
      .trigger("dragend");

    // Verify item3 is now in selected items
    cy.get("#selectedItems").find('[data-item="item3"]').should("exist");
    cy.get("#selectedItems").should("contain", "Элемент 3");
  });

  it("Drag tasks to in progress and done", () => {
    // Drag task1 Создать дизайн
    cy.get("#todoContainer").find('[data-task="task1"]').scrollIntoView().drag("#progressContainer");
    cy.get("#progressContainer").find('[data-task="task1"]').should("exist");
    cy.get("#progressContainer").should("contain", "Создать дизайн");

    // Drag task2 Написать тесты
    cy.get("#todoContainer").find('[data-task="task2"]').scrollIntoView().drag("#progressContainer");
    cy.get("#progressContainer").find('[data-task="task2"]').should("exist");
    cy.get("#progressContainer").should("contain", "Unit и E2E тесты");

    // Drag task1, task2, task4 to Done
    cy.get("#progressContainer").find('[data-task="task1"]').scrollIntoView().drag("#doneContainer");
    cy.get("#progressContainer").find('[data-task="task2"]').scrollIntoView().drag("#doneContainer");
    cy.get("#progressContainer").find('[data-task="task4"]').scrollIntoView().drag("#doneContainer");

    cy.get("#doneContainer").find('[data-task="task1"]').should("exist");
    cy.get("#doneContainer").find('[data-task="task2"]').should("exist");
    cy.get("#doneContainer").find('[data-task="task4"]').should("exist");
    cy.get("#doneContainer").should("contain", "Разработка API");
    cy.get("#doneContainer").should("contain", "Создать дизайн");
    cy.get("#doneContainer").should("contain", "Написать тесты");
  });
});

describe("iFrames", () => {
  it("Simple iFrame", () => {
    cy.frameLoaded("#advanced #simpleFrame");
    cy.iframe("#advanced #simpleFrame").find("#iframeButton").click();
    cy.iframe("#advanced #simpleFrame").contains("Кнопка нажата!").should("exist");
    cy.iframe("#advanced #simpleFrame").find("#iframeResult").should("include.text", "Кнопка нажата!");
  });
});
