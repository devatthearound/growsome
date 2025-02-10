require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 9003;

// 환경변수 확인 로그 추가
console.log('Starting server with:', {
  port,
  clientId: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET?.slice(0, 4) + '...'
});

// CORS 설정 수정
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept']
}));

app.use(express.json());

app.get('/api/search/shop', async (req, res) => {
  try {
    const response = await axios.get('https://openapi.naver.com/v1/search/shop.json', {
      params: { query: req.query.query },
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Search error:', error.response?.data);
    res.status(401).json(error.response?.data);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});