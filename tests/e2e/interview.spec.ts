// tests/e2e/login.spec.ts
import { test, expect } from "@playwright/test";

test.describe("인터뷰 진행", () => {

  test("인터뷰 주제 선택 및 진행 - 유튜버와 나 그 사이 어딘가", async ({page}) => {

    page.addInitScript(() => {
      localStorage.setItem(
        "hidden-category-codes",
        JSON.stringify(["HIDDEN_3fEMQ1"])
      );
    });

    // 인터뷰 주제 선택
    await page.goto("/dashboard/home"); // 대시보드로 이동
    await page.getByText("유튜버와 나 그 사이 어딘가").click();
    await page.getByText("지금 시작하기").first().click();

    // 인터뷰 설정
    await page.getByText("충분히 고민하고 생각 정리 했어요").click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.getByText("혼자만의 환경을 준비했어요").click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.getByText("마이크 테스트를 완료했어요").click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page
      .locator("canvas")
      .first()
      .click({
        position: {
          x: 77,
          y: 12,
        },
      });
    await page.getByRole("button", { name: "돌아가기" }).click();
    await page
      .locator("canvas")
      .nth(2)
      .click({
        position: {
          x: 51,
          y: 23,
        },
      });
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.getByRole("button", { name: "모노톤" }).click();
    await page.getByRole("button", { name: "밝기 증가" }).click();
    await page.getByRole("button", { name: "네추럴" }).click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.waitForTimeout(25000);

    // 인터뷰 진행
    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("아래 문구를 따라 읽어주세요")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    // 25초 대기
    await page.waitForTimeout(25000);
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();

    // 인터뷰 제목 설정
    await page
      .getByRole("textbox", { name: "인터뷰 제목을 입력해주세요" })
      .click();
    await page
      .getByRole("textbox", { name: "인터뷰 제목을 입력해주세요" })
      .fill("(auto) 테스트 인터뷰");
    await page.getByRole("button", { name: "완료" }).click();

    // 인터뷰 썸네일 촬영
    await page.getByRole("button", { name: "촬영하기" }).click();
    await page.getByRole("button", { name: "다시 찍기" }).click();
    await page.getByRole("button", { name: "이 사진으로 할게요" }).click();

    // 완료 후 홈으로 이동
    await page
      .getByRole("button", { name: "left arrow 홈으로 돌아가기" })
      .click();
  });

  test("인터뷰 주제 선택 및 진행 - 창업을 꿈꾸는 당신에게", async ({page}) => {

    page.addInitScript(() => {
      localStorage.setItem(
        "hidden-category-codes",
        JSON.stringify(["HIDDEN_3fEMQ2"])
      );
    });

    // 인터뷰 주제 선택
    await page.goto("/dashboard/home"); // 대시보드로 이동
    await page.getByText("창업을 꿈꾸는 당신에게").click();
    await page.getByText("지금 시작하기").first().click();

    // 인터뷰 설정
    await page.getByText("충분히 고민하고 생각 정리 했어요").click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.getByText("혼자만의 환경을 준비했어요").click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.getByText("마이크 테스트를 완료했어요").click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page
      .locator("canvas")
      .first()
      .click({
        position: {
          x: 77,
          y: 12,
        },
      });
    await page.getByRole("button", { name: "돌아가기" }).click();
    await page
      .locator("canvas")
      .nth(2)
      .click({
        position: {
          x: 51,
          y: 23,
        },
      });
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.getByRole("button", { name: "모노톤" }).click();
    await page.getByRole("button", { name: "밝기 증가" }).click();
    await page.getByRole("button", { name: "네추럴" }).click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.waitForTimeout(25000);

    // 인터뷰 진행
    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("아래 문구를 따라 읽어주세요")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    // 25초 대기
    await page.waitForTimeout(25000);
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();

    // 인터뷰 제목 설정
    await page
      .getByRole("textbox", { name: "인터뷰 제목을 입력해주세요" })
      .click();
    await page
      .getByRole("textbox", { name: "인터뷰 제목을 입력해주세요" })
      .fill("(auto) 테스트 인터뷰");
    await page.getByRole("button", { name: "완료" }).click();

    // 인터뷰 썸네일 촬영
    await page.getByRole("button", { name: "촬영하기" }).click();
    await page.getByRole("button", { name: "다시 찍기" }).click();
    await page.getByRole("button", { name: "이 사진으로 할게요" }).click();

    // 완료 후 홈으로 이동
    await page
      .getByRole("button", { name: "left arrow 홈으로 돌아가기" })
      .click();
  });

  test("인터뷰 주제 선택 및 진행 - 흔들리지 않고 피는 꽃은 없다", async ({
    page,
  }) => {
    // 인터뷰 주제 선택
    await page.goto("/dashboard/home"); // 대시보드로 이동
    await page.getByText("흔들리지 않고 피는 꽃은 없다").click();
    await page.getByText("지금 시작하기").first().click();

    // 인터뷰 설정
    await page.getByText("충분히 고민하고 생각 정리 했어요").click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.getByText("혼자만의 환경을 준비했어요").click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.getByText("마이크 테스트를 완료했어요").click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page
      .locator("canvas")
      .first()
      .click({
        position: {
          x: 77,
          y: 12,
        },
      });
    await page.getByRole("button", { name: "돌아가기" }).click();
    await page
      .locator("canvas")
      .nth(2)
      .click({
        position: {
          x: 51,
          y: 23,
        },
      });
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.getByRole("button", { name: "모노톤" }).click();
    await page.getByRole("button", { name: "밝기 증가" }).click();
    await page.getByRole("button", { name: "네추럴" }).click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.waitForTimeout(25000);

    // 인터뷰 진행
    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("번째 질문")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    await expect(page.getByText("아래 문구를 따라 읽어주세요")).toBeVisible();
    await page.getByRole("button", { name: "right-arrow" }).click();

    // 25초 대기
    await page.waitForTimeout(25000);
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();

    // 인터뷰 제목 설정
    await page
      .getByRole("textbox", { name: "인터뷰 제목을 입력해주세요" })
      .click();
    await page
      .getByRole("textbox", { name: "인터뷰 제목을 입력해주세요" })
      .fill("(auto) 테스트 인터뷰");
    await page.getByRole("button", { name: "완료" }).click();

    // 인터뷰 썸네일 촬영
    await page.getByRole("button", { name: "촬영하기" }).click();
    await page.getByRole("button", { name: "다시 찍기" }).click();
    await page.getByRole("button", { name: "이 사진으로 할게요" }).click();

    // 완료 후 홈으로 이동
    await page
      .getByRole("button", { name: "left arrow 홈으로 돌아가기" })
      .click();
  });

  test("인터뷰 주제 선택 및 진행 - 미래는 등 뒤에 있지 않다", async ({
    page,
  }) => {
    // 인터뷰 주제 선택
    await page.goto("/dashboard/home"); // 대시보드로 이동
    await page.getByText("미래는 등 뒤에 있지 않다").click();
    await page.getByText("지금 시작하기").first().click();

    // 인터뷰 설정
    await page.getByText("충분히 고민하고 생각 정리 했어요").click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.getByText("혼자만의 환경을 준비했어요").click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.getByText("마이크 테스트를 완료했어요").click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page
      .locator("canvas")
      .first()
      .click({
        position: {
          x: 77,
          y: 12,
        },
      });
    await page.getByRole("button", { name: "돌아가기" }).click();
    await page
      .locator("canvas")
      .nth(2)
      .click({
        position: {
          x: 51,
          y: 23,
        },
      });
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.getByRole("button", { name: "모노톤" }).click();
    await page.getByRole("button", { name: "밝기 증가" }).click();
    await page.getByRole("button", { name: "네추럴" }).click();
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();
    await page.waitForTimeout(25000);

    // 인터뷰 진행
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "right-arrow" }).click();

    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "right-arrow" }).click();

    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "right-arrow" }).click();

    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "right-arrow" }).click();

    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "right-arrow" }).click();

    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "right-arrow" }).click();

    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "right-arrow" }).click();

    // 25초 대기
    await page.waitForTimeout(25000);
    await page.getByRole("button", { name: "다음으로 right-arrow" }).click();

    // 인터뷰 제목 설정
    await page
      .getByRole("textbox", { name: "인터뷰 제목을 입력해주세요" })
      .click();
    await page
      .getByRole("textbox", { name: "인터뷰 제목을 입력해주세요" })
      .fill("(auto) 테스트 인터뷰");
    await page.getByRole("button", { name: "완료" }).click();

    // 인터뷰 썸네일 촬영
    await page.getByRole("button", { name: "촬영하기" }).click();
    await page.getByRole("button", { name: "다시 찍기" }).click();
    await page.getByRole("button", { name: "이 사진으로 할게요" }).click();

    // 완료 후 홈으로 이동
    await page
      .getByRole("button", { name: "left arrow 홈으로 돌아가기" })
      .click();
  });
});
