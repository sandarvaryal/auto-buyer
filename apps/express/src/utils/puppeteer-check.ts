// import puppeteer from "puppeteer";

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const loginAndNotify = async (email: string, password: string) => {
  console.log({ email, password });
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.setUserAgent("Safari/537.36");
  // await page.goto("https://bot.sannysoft.com");
  // await page.screenshot({ path: "bot.jpg" });

  try {
    await page.goto("https://member.daraz.com.np/user/login");
    console.log("opened page");

    // await page.type(".mod-login-input-loginName > input", email);
    // await page.type(".mod-login-input-password > input", password);

    // await page.focus(
    //   "#container > div > div:nth-child(2) > form > div > div.mod-login-col1 > div.mod-input.mod-login-input-loginName.mod-input-loginName > input[type=text]"
    // );
    await page.type(
      "#container > div > div:nth-child(2) > form > div > div.mod-login-col1 > div.mod-input.mod-login-input-loginName.mod-input-loginName > input[type=text]",
      email
    );
    // await page.focus(
    //   "#container > div > div:nth-child(2) > form > div > div.mod-login-col1 > div.mod-input.mod-input-password.mod-login-input-password.mod-input-password > input[type=password]"
    // );
    await page.type(
      "#container > div > div:nth-child(2) > form > div > div.mod-login-col1 > div.mod-input.mod-input-password.mod-login-input-password.mod-input-password > input[type=password]",
      password
    );
    console.log("added email and password");

    // await Promise.all([
    //   page.click(".mod-login-btn > button"),
    //   console.log("clicked on submit button"),
    //   // page.waitForNavigation({ waitUntil: "networkidle0" }),
    //   page.waitForNavigation(),
    // ]);

    try {
      await Promise.all([
        // page.click(".mod-login-btn > button"),
        page.click(
          "#container > div > div:nth-child(2) > form > div > div.mod-login-col2 > div.mod-login-btn > button"
        ),
        console.log("clicked on submit button"),
        page.waitForNavigation(),
      ]);
    } catch (error) {
      console.log("ran :(");
      return "wrong credentials";
    }
    console.log("progress");

    const loginSuccess = await page.evaluate(() => {
      // return !!document.querySelector(".logout");
      return !!document.querySelector(
        "#lzdMyAccountPop > div > ul > li:nth-child(6) > a"
      );
    });

    if (!loginSuccess) {
      console.log("login didnt succeed");
      return "incorrect credentials";
    } else {
      console.log("correct credentials");
      //saving cookies for later use
      const srcDir = path.resolve(__dirname, "..");
      const cookieDir = path.join(srcDir, "cookies");

      const cookies = await page.cookies();
      const cookieFilePath = path.join(cookieDir, `${email}-cookies.json`);
      fs.writeFileSync(cookieFilePath, JSON.stringify(cookies, null, 2));

      return "credentials verified";
    }
  } catch (error) {
    console.error("Error during login:", error);
  } finally {
    await browser.close();
  }
};
