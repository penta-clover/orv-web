// tests/e2e/login.spec.ts
import { test, expect } from "@playwright/test";
import { TEST_USERS } from "../fixtures/user";

test.describe("사용자 로그인 및 인증 테스트", () => {
  // test("사용자 인증 정보가 없다면 로그인 창으로 이동해야 함", async ({
  //   page,
  // }) => {
  //   await page.goto("/");
  //   await expect(page).toHaveURL("/auth/desktop");
  // });

  test("사용자 인증 정보가 있다면 대시보드로 이동해야 함", async ({ page }) => {

    await page.goto("/");
    await expect(page).toHaveURL("/dashboard/home");
  });
});
