export function createSlug(text: string): string {
  return text
    .toLowerCase() // 소문자로 변환
    .trim() // 앞뒤 공백 제거
    .replace(/[^\w\s-]/g, '') // 특수문자 제거 (하이픈과 공백 제외)
    .replace(/[\s_-]+/g, '-') // 공백, 언더스코어, 하이픈을 단일 하이픈으로 변환
    .replace(/^-+|-+$/g, '') // 시작과 끝의 하이픈 제거
    .normalize('NFD') // 한글 자모 분리
    .replace(/[\u0300-\u036f]/g, '') // 발음 구별 기호 제거
    + '-' + Date.now().toString().slice(-4); // 고유성을 위해 타임스탬프 추가
} 