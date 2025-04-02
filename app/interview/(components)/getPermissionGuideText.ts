export const getPermissionGuideText = () => {
  const ua = navigator.userAgent;
  let instructions = "마이크와 카메라 권한을 허용해주세요.";

  if (ua.includes("Mac OS X")) {
    instructions += "\n\n[설정 방법]";
    if (ua.includes("Chrome") && !ua.includes("Edge")) {
      instructions +=
        "\n주소창 왼쪽의 자물쇠 아이콘 클릭 → 사이트 설정 → 마이크/카메라 권한을 '허용'으로 변경";
    } else if (ua.includes("Firefox")) {
      instructions +=
        "\n주소창 왼쪽의 자물쇠 아이콘 클릭 → 권한 섹션에서 마이크/카메라 권한을 '허용'으로 변경";
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      instructions +=
        "\n좌측 상단 Safari 메뉴 → 설정 → 웹사이트 → 마이크/카메라 항목에서 orv.im을 '허용'으로 변경 → 사이트 새로고침";
    } else {
      instructions += "\n사용 중인 브라우저에서 마이크/카메라 권한을 허용한 뒤 사이트를 새로고침해주세요.";
    }
  } else if (ua.includes("Windows")) {
    instructions += "\n\n[설정 방법]";
    if (ua.includes("Chrome") && !ua.includes("Edge")) {
      instructions +=
        "\n주소창 왼쪽의 자물쇠 아이콘 클릭 → 사이트 설정 → 마이크/카메라 권한을 '허용'으로 변경";
    } else if (ua.includes("Firefox")) {
      instructions +=
        "\n주소창 왼쪽의 자물쇠 아이콘 클릭 → 권한 섹션에서 마이크/카메라 권한을 '허용'으로 변경";
    } else if (ua.includes("Edge")) {
      instructions +=
        "\n주소창 왼쪽의 자물쇠 아이콘 클릭 → 사이트 권한에서 마이크/카메라를 '허용'으로 변경";
    } else {
      instructions += "\n사용 중인 브라우저에서 마이크/카메라 권한을 허용한 뒤 사이트를 새로고침해주세요.";
    }
  } else {
    instructions += "\n\n사용 중인 운영체제에서 마이크/카메라 권한을 허용한 뒤 사이트를 새로고침해주세요.";
  }
  
  return instructions;
};
