import axios from 'axios';
import CryptoJS from 'crypto-js';

// 테스트용 임시 데이터
const MOCK_PRODUCTS = [
  {
    productId: "6701130624",
    title: "고성능 게이밍PC 조립컴퓨터",
    price: 1599000,
    originalPrice: 1799000,
    imageUrl: "https://example.com/image1.jpg",
    detailUrl: "https://example.com/product1",
    rating: 4.8,
    reviewCount: 245,
    isRocket: true
  },
  // ... 더 많은 테스트 상품 데이터
];

export const searchCoupangProducts = async (keyword) => {
  try {
    // 실제 API 구현 시 아래 주석을 해제하고 사용
    /*
    const REQUEST_METHOD = "GET";
    const DOMAIN = "https://api-gateway.coupang.com";
    const URL = "/v2/providers/affiliate_open_api/apis/openapi/products/search";
    
    const timestamp = Date.now();
    const message = `${REQUEST_METHOD} ${URL}\n${timestamp}\n${process.env.REACT_APP_COUPANG_ACCESS_KEY}`;
    const hmac = CryptoJS.HmacSHA256(message, process.env.REACT_APP_COUPANG_SECRET_KEY);
    const signature = CryptoJS.enc.Base64.stringify(hmac);

    const response = await axios({
      method: REQUEST_METHOD,
      url: `${DOMAIN}${URL}`,
      headers: {
        "Authorization": `HMAC-SHA256 ${process.env.REACT_APP_COUPANG_ACCESS_KEY}:${signature}`,
        "X-Timestamp": timestamp,
        "Content-Type": "application/json"
      },
      params: {
        keyword: keyword,
        limit: 10,
        subId: process.env.REACT_APP_COUPANG_SUBID
      }
    });

    return processProductData(response.data.products);
    */

    // 테스트용 목업 데이터 반환
    return MOCK_PRODUCTS;
  } catch (error) {
    console.error('쿠팡 API 오류:', error);
    return [];
  }
};

export const generateAffiliateLink = async (productId) => {
  try {
    // 실제 API 구현 시 아래 주석을 해제하고 사용
    /*
    const REQUEST_METHOD = "GET";
    const DOMAIN = "https://api-gateway.coupang.com";
    const URL = "/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink";
    
    const timestamp = Date.now();
    const message = `${REQUEST_METHOD} ${URL}\n${timestamp}\n${process.env.REACT_APP_COUPANG_ACCESS_KEY}`;
    const hmac = CryptoJS.HmacSHA256(message, process.env.REACT_APP_COUPANG_SECRET_KEY);
    const signature = CryptoJS.enc.Base64.stringify(hmac);

    const response = await axios({
      method: REQUEST_METHOD,
      url: `${DOMAIN}${URL}`,
      headers: {
        "Authorization": `HMAC-SHA256 ${process.env.REACT_APP_COUPANG_ACCESS_KEY}:${signature}`,
        "X-Timestamp": timestamp,
        "Content-Type": "application/json"
      },
      params: {
        coupangUrl: `https://www.coupang.com/vp/products/${productId}`,
        subId: process.env.REACT_APP_COUPANG_SUBID
      }
    });

    return response.data.shortenUrl;
    */

    // 테스트용 목업 링크 반환
    return `https://link.coupang.com/re/AFFSDP?lptag=AF8318004&pageKey=${productId}&subId=test`;
  } catch (error) {
    console.error('쿠팡 링크 생성 오류:', error);
    return null;
  }
};

const processProductData = (products) => {
  return products.map(product => ({
    productId: product.productId,
    title: product.title,
    price: product.price,
    originalPrice: product.originalPrice,
    imageUrl: product.imageUrl,
    detailUrl: product.detailUrl,
    rating: product.rating,
    reviewCount: product.reviewCount,
    isRocket: product.isRocket
  }));
};
