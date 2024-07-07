import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
puppeteer.use(StealthPlugin());

export const checkPriceAndAddToCart = async (
  email: string,
  url: string,
  priceCriteria: number
) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1080,
    height: 720,
    deviceScaleFactor: 1,
  });

  // const cookieFilePath = path.join(
  //   process.env.COOKIES_DIR as string,
  //   `${email}-cookies.json`
  // );

  const srcDir = path.resolve(__dirname, "..");
  const cookieDir = path.join(srcDir, "cookies");
  const cookieFilePath = path.join(cookieDir, `${email}-cookies.json`);

  if (fs.existsSync(cookieFilePath)) {
    const cookies = JSON.parse(fs.readFileSync(cookieFilePath, "utf-8"));
    console.log(cookies);
    await page.setCookie(...cookies);
  } else {
    throw new Error(`No cookies found for account ${email}`);
  }

  await page.goto(url, { waitUntil: "networkidle0" });

  try {
    const PRICE_SELECTOR = "#module_product_price_1 > div > div > span";
    await page.reload({ waitUntil: "networkidle0" });

    const priceTextElement = await page.$(PRICE_SELECTOR);
    if (!priceTextElement) {
      throw new Error(
        `Price element '${PRICE_SELECTOR}' not found on the page`
      );
    }
    const priceText = await page.evaluate(
      (el) => el.textContent?.trim(),
      priceTextElement
    );

    if (!priceText) {
      throw new Error(
        `Price text is empty or undefined for element '${PRICE_SELECTOR}'`
      );
    }
    const price = parseFloat(priceText.replace("Rs.", "").replace(/,/g, ""));
    console.log(`Current price for account ${email}:`, price);

    if (price <= priceCriteria) {
      console.log(`Price has dropped! Adding to cart for account: ${email}`);
      await page.click(
        "#module_add_to_cart > div > button.add-to-cart-buy-now-btn.pdp-button.pdp-button_type_text.pdp-button_theme_orange.pdp-button_size_xl"
      );
      //logic
      return true;
    } else {
      console.log(`Price is not below the threshold for account: ${email}`);
      return false;
    }
  } catch (error) {
    console.error(`Error checking price for account ${email}:`, error);
    return false;
  } finally {
    await browser.close();
  }
};
