class FormLayoutsPage {
  /**
   * Method to submit Using Grid form
   * @param {string} email - user email
   * @param {string} password - user password
   * @param {number} optionIndex - index of option
   */
  submitGridForm(email, password, optionIndex) {
    cy.contains("nb-card", "Using the Grid").then((form) => {
      cy.wrap(form).find("#inputEmail1").type(email);
      cy.wrap(form).find("#inputPassword2").type(password);
      cy.wrap(form).find('[type="radio"]').eq(optionIndex).check({ force: true });
      cy.wrap(form).contains("Sign in").click();
    });
  }
  /**
   * Method to submit Using Basic form
   * @param {string} email - user email
   * @param {string} password - user password
   * @param {boolean} isCheckboxSelected - choose checkbox is true/false
   */
  submitBasicForm(email, password, isCheckboxSelected) {
    cy.contains("nb-card", "Basic form").then((form) => {
      cy.wrap(form).find("#exampleInputEmail1").type(email);
      cy.wrap(form).find("#exampleInputPassword1").type(password);
      if (isCheckboxSelected) {
        cy.wrap(form).find('[type="checkbox"]').check({ force: true });
      }
      cy.wrap(form).contains("Submit").click();
    });
  }
}

export const formLayoutsPage = new FormLayoutsPage();
