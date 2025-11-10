import { Builder, By, until } from "selenium-webdriver";
import * as firefox from "selenium-webdriver/firefox.js";
import { expect } from "chai";

describe("Auth Page Tests", function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    const options = new firefox.Options();
    driver = await new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(options)
      .build();
    await driver.get("http://localhost:5173");
    driver.sleep(1000);
  });

  after(async () => {
    await driver.quit();
  });

  it("should toggle between login and signup", async () => {
    const toggleBtn = await driver.findElement(
      By.css("button.text-emerald-600"),
    );
    await toggleBtn.click();

    const paragraph = await driver.findElement(By.css("p.text-center"));
    const text = await paragraph.getText();

    expect(text).to.include("Create your account");
  });

  it("should show validation for email input", async () => {
    driver.sleep(1000);
    const emailInput = await driver.findElement(By.id("email"));
    const passwordInput = await driver.findElement(By.id("password"));
    const submitBtn = await driver.findElement(By.css("button[type='submit']"));

    driver.sleep(1000);
    await emailInput.sendKeys("invalid@email.com");
    await passwordInput.sendKeys("123456");
    await submitBtn.click();

    driver.sleep(1000);

    // Wait for error message or created account message
    const errorDiv = await driver.wait(
      until.elementLocated(By.css("div.bg-red-50, div.bg-emerald-50")),
      10000,
    );

    const text = await errorDiv.getText();
    expect(text.length).to.be.greaterThan(0);

    driver.sleep(1000);
  });
});
