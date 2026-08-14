import { expect } from "./base";

export class GeneralFunctions {
  constructor(page) {
    this.page = page;
  }

  async checkForElementVisibility(elements, isVisible = true) {
    if (Array.isArray(elements)) {
      for (const element of elements) {
        if (isVisible) await expect(element).toBeVisible();
        else {
          await expect(element).not.toBeVisible();
        }
      }
    } else {
      if (isVisible) await expect(elements).toBeVisible();
      else {
        await expect(elements).not.toBeVisible();
      }
    }
  }

  async generateRandomString(
    numberOfLetters = 25,
    onlyLetters = false,
    onlyDigits = false
  ) {
    let characters;
    if (onlyLetters) {
      characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    } else if (onlyDigits) {
      characters = "123456789";
    } else {
      characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    }
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < numberOfLetters; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  async updateParam(parameter, newValue) {
    let currentURLStr = await this.page.url();
    let currentURL = new URL(currentURLStr);
    currentURL.searchParams.set(parameter, await newValue);
    return currentURL.toString();
  }
}
