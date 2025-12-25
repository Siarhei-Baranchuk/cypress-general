import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // baseUrl: "https://playground.bondaracademy.com/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: true,
  screenshotOnRunFailure: true,
  watchForFileChanges: false,
});
