// JWT의 payload(가운데 부분)를 읽어 회원 ID를 꺼냄
// 서명 검증 없이 읽기만 하므로, 화면 표시와 요청 주소 구성에만 사용
// 실제 권한 확인은 서버가 토큰으로 다시 
export function getMemberIdFromToken(token: string | null): number | null {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    // 백엔드에서 memberId를 subject(sub)에 넣었다고 가정
    const memberId = Number(json.memberId ?? json.sub);
    return Number.isInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}