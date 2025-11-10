// tests/app.spec.js
import { Builder, By, until } from "selenium-webdriver";
import * as firefox from "selenium-webdriver/firefox.js";
import { expect } from "chai";

describe("React App E2E Test (Firefox)", function () {
  this.timeout(30000); // 30 seconds timeout
  let driver;

  before(async () => {
    const options = new firefox.Options();
    //options.headless(); // run without opening browser window

    driver = await new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(options)
      .build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it("should load the homepage and display the main title", async () => {
    await driver.get("http://localhost:5173"); // your local dev URL

    const heading = await driver.wait(
      until.elementLocated(By.css("h1")),
      10000,
    );

    const text = await heading.getText();
    expect(text).to.contain("Expense Tracker"); // your homepage title
  });
});
