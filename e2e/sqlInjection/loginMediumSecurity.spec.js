import { test } from "../../modules/base";
import pages from "../../fixtures/pages.json";

test.describe("SQL Injection login tests (Medium security)", () => {
  test.beforeEach(async ({ login }) => {
    await test.step("Log in with medium security", async () => {
      await login.loginUser({ securityLevel: "medium" });
    });
  });

  /* These tests will pass because basic SQL injections will not work, as is expected in a real app */

  test(
    "Medium - Login Form - Hero (Username injections)",
    {
      tag: ["@security", "@sqlInjection"],
    },
    async ({ generalFunctions, login }) => {
      await test.step("Go to the 'Login Form/Hero' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.loginHero);
      });

      await test.step("Verify and log SQL injections for username field (with random password)", async () => {
        await login.verifyLoginPageInjections({});
      });
    }
  );

  test(
    "Medium - Login Form - Hero (Password injections)",
    {
      tag: ["@security", "@sqlInjection"],
    },
    async ({ generalFunctions, login }) => {
      await test.step("Go to the 'Login Form/Hero' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.loginHero);
      });

      await test.step("Verify and log SQL injections for password field (with valid username)", async () => {
        await login.verifyLoginPageInjections({ username: "neo" });
      });
    }
  );

  test(
    "Medium - Login Form - User (Username injections)",
    {
      tag: ["@security", "@sqlInjection"],
    },
    async ({ generalFunctions, login }) => {
      await test.step("Go to the 'Login Form/User' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.loginUser);
      });

      await test.step("Verify and log SQL injections for username field (with random password)", async () => {
        await login.verifyLoginPageInjections({});
      });
    }
  );

  test(
    "Medium - Login Form - User (Password injections)",
    {
      tag: ["@security", "@sqlInjection"],
    },
    async ({ generalFunctions, login }) => {
      await test.step("Go to the 'Login Form/User' page", async () => {
        await generalFunctions.visitPage(pages.defaultPages.loginUser);
      });

      await test.step("Verify and log SQL injections for password field (with valid username)", async () => {
        await login.verifyLoginPageInjections({ username: "bee" });
      });
    }
  );
});
