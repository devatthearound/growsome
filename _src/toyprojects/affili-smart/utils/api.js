const axios = require('axios');
const { ClientCredentials } = require('simple-oauth2');

// OAuth2 클라이언트 설정
const config = {
  client: {
    id: 'YOUR_CLIENT_ID',
    secret: 'YOUR_CLIENT_SECRET',
  },
  auth: {
    tokenHost: 'https://api.coupang.com',
  },
};

const client = new ClientCredentials(config);

// OAuth2 토큰 요청
async function getAccessToken() {
  try {
    const tokenParams = {
      scope: 'YOUR_SCOPE',
    };
    const accessToken = await client.getToken(tokenParams);
    return accessToken.token.access_token;
  } catch (error) {
    console.error('Access Token Error', error.message);
  }
}

// API 요청
async function fetchCoupangData() {
  const token = await getAccessToken();
  const response = await axios.get('https://api.coupang.com/v2/providers/affiliate_open_api/apis/openapi/v1/products', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
}

fetchCoupangData();const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Add more API functions as needed