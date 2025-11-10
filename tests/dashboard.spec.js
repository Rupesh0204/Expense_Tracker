import { Builder, By, until } from "selenium-webdriver";
import * as firefox from "selenium-webdriver/firefox.js";
import { expect } from "chai";

describe("Dashboard Tests", function () {
  this.timeout(40000);
  let driver;

  before(async () => {
    const options = new firefox.Options();
    driver = await new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(options)
      .build();
    await driver.get("http://localhost:5173");

    driver.sleep(1000);

    // Set fake login token
    await driver.executeScript(`
      localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTFhOTRmNjYzYTRiNTFkYmUzOTc3MCIsImVtYWlsIjoic29maWM4NDk2NUBmYW5kb2UuY29tIiwiaWF0IjoxNzYyNzY2MDgwLCJleHAiOjE3NjMzNzA4ODB9.BUE-tsSelmLuF_3mag54za7KkgbjkkzDfS9v5DThvnw");
    `);

    await driver.navigate().refresh();
  });

  after(async () => {
    await driver.quit();
  });

  it("should display Dashboard header", async () => {
    const header = await driver.wait(
      until.elementLocated(By.css("h1.text-3xl")),
      10000,
    );
    const text = await header.getText();
    expect(text).to.include("Expense Tracker");
  });

  it("should open Add Expense modal", async () => {
    const addButton = await driver.findElement(
      By.xpath("//button[contains(., 'Add Expense')]"),
    );
    await addButton.click();

    const modal = await driver.wait(
      until.elementLocated(By.css(".main")),
      10000,
    );
    const title = await modal.findElement(By.css("h2"));
    const text = await title.getText();

    expect(text).to.include("Add Expense");
  });
});
