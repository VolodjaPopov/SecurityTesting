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
}
