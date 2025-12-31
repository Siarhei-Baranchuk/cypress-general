/// <reference types="cypress" />

import { datePickerPage } from "../page-objects/datepickerPage";
import { formLayoutsPage } from "../page-objects/formLayoutPage";
import { navigateTo } from "../page-objects/navigationPage";

beforeEach("Open test application", () => {
  //   cy.visit("https://playground.bondaracademy.com/");
  cy.openHomePage();
});

it("Navigation test", () => {
  navigateTo.formLayoutsPage();
  navigateTo.datePickerPage();
  navigateTo.toastrPage();
  navigateTo.tooltipPage();
});

it("Form Layouts - Using the Grid", () => {
  navigateTo.formLayoutsPage();
  formLayoutsPage.submitGridForm("mail@mail.com", "password", 0);
  formLayoutsPage.submitGridForm("r@2.com", "pass", "1");
});

it("Form Layouts - Basic form", () => {
  navigateTo.formLayoutsPage();
  formLayoutsPage.submitBasicForm("mail@mail.com", "password", true);
});

it("Datepickers: Common Datepicker, Datepicker With Range", () => {
  navigateTo.datePickerPage();
  datePickerPage.selectCommonDatepickerDateFromToday(15);
  datePickerPage.selectRangeDatepickerDateFromToday(25, 88);
});
