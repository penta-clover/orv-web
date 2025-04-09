/**
 * 문자열 내의 플레이스홀더를 replacements 객체의 값으로 치환합니다.
 * 플레이스홀더 형식은 "@{변수명}"입니다.
 *
 * @param input - 치환할 문자열 예: "@{name}님께서 가장 좋아하시는 음식은 @{favoriteFood}입니다."
 * @param replacements - 변수명과 치환할 값을 가진 객체 예: { name: "현준", favoriteFood: "김치찌개" }
 * @returns 치환된 문자열
 */
export function evaluateTemplate(
  input: string,
  replacements: { key: string; value: string }[]
): string {
  return input.replace(/@\{(\w+)\}/g, (match: string, key: string) => {
    const replacement = replacements.find((r) => r.key === key);
    return replacement ? replacement.value : match;
  });
}
