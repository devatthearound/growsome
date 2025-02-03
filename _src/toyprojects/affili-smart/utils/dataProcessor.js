/**
 * 상품 데이터를 정리하고 가성비를 기준으로 TOP N 리스트를 생성합니다.
 * @param {Array} products - 상품 데이터 배열
 * @param {number} topN - 상위 N개의 상품을 선택
 * @returns {Array} - 가성비 TOP N 리스트
 */
function calculateTopN(products, topN) {
  // 가성비 계산 예시: 가격 대비 평점
  const sortedProducts = products.sort((a, b) => {
    const valueA = parseFloat(a.rating) / parseFloat(a.price.replace(/,/g, ''));
    const valueB = parseFloat(b.rating) / parseFloat(b.price.replace(/,/g, ''));
    return valueB - valueA;
  });

  return sortedProducts.slice(0, topN);
}

module.exports = { calculateTopN };
