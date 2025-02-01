const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 4002;  // 포트 번호를 명시적으로 4002로 설정

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept", "X-Naver-Client-Id", "X-Naver-Client-Secret"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/search/shop", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const apiUrl = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=20&sort=sim`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET
      }
    });

    console.log("Naver API response:", response.status);
    res.json(response.data);
  } catch (error) {
    console.error("Error details:", error);
    res.status(error.response?.status || 500).json({
      error: "API Error",
      message: error.message,
      details: error.response?.data
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
