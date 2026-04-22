const express = require("express");
const cors = require("cors");
const axios = require("axios");
async function getRealPrice(product) {
  try {
    // דמו משופר (שלב ביניים)
    // בעתיד נחבר API אמיתי
    const base = 3500;
    const variation = Math.floor(Math.random() * 800);

    return base + variation;
  } catch (err) {
    console.log("Price fetch error:", err.message);
    return null;
  }
}

const TELEGRAM_TOKEN = "8463183093:AAEEqIoFbPoe4JrUdUBUMaerGO9MzOnoLG0";
function sendTelegramMessage(chatId, message) {
  axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    chat_id: chatId,
    text: message
  });
}

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 נתונים זמניים (בהמשך יהיה DB)
let products = [];
let trackedProducts = [];
let alerted = new Set();

// 🔹 קבלת כל המוצרים
app.get("/products", (req, res) => {
  res.json(products);
});

// 🔹 הוספת מוצר
app.post("/products", (req, res) => {
  const product = req.body;
  products.push(product);
  res.json({ message: "Product added", product });
});

// 🔥 מנוע חיפוש (Core של הסטארטאפ)
app.get("/search", (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query" });
  }

  const prices = [
    { store: "Amazon", price: 4200 },
    { store: "eBay", price: 3990 },
    { store: "KSP", price: 4100 }
  ];

  const best = prices.reduce((min, p) =>
    p.price < min.price ? p : min
  );

  const avg =
    prices.reduce((sum, p) => sum + p.price, 0) / prices.length;

  // 🧠 החלטה חכמה
  let decision = "";
  let reason = "";

  if (best.price < avg * 0.95) {
    decision = "BUY NOW";
    reason = "מחיר נמוך מהממוצע בשוק";
  } else if (best.price > avg * 1.05) {
    decision = "WAIT";
    reason = "המחיר גבוה מהממוצע, סביר שיירד";
  } else {
    decision = "NORMAL";
    reason = "מחיר באזור הממוצע";
  }

  const response = {
    product: query,
    bestDeal: best,
    averagePrice: Math.round(avg),
    decision,
    reason,
    recommendation: `${decision} - ${reason}`
  };

  res.json(response);
});

app.post("/track", (req, res) => {
  const { product, targetPrice, email, telegramId } = req.body;

  if (!product) {
    return res.status(400).json({ error: "Missing product" });
  }

trackedProducts.push({
  product,
  targetPrice,
  email,
  telegramId,
  lastPrice: null
});

  console.log("📌 New tracking:", trackedProducts);
if (telegramId) {
  sendTelegramMessage(
    telegramId,
    `🔥 התחלת מעקב על ${product}\n🎯 יעד מחיר: ${targetPrice}₪`
  );
}

  res.json({ message: "Tracking started" });
});

// 🔹 הפעלת השרת
// 🔥 מנוע התראות חכם (אם עדיין לא נמצא בקובץ)
setInterval(async () => {
  for (const item of trackedProducts) {
    const currentPrice = await getRealPrice(item.product);

    if (!currentPrice) continue;

    const avgPrice = 4000;

    const isFirstCheck = item.lastPrice === null;
    const priceDropped = currentPrice < item.lastPrice * 0.97;
    const crazyDeal = currentPrice < avgPrice * 0.9;
    const reachedTarget =
      item.targetPrice && currentPrice <= item.targetPrice;

    if (isFirstCheck || priceDropped || crazyDeal || reachedTarget) {
      console.log(`🔥 ALERT: ${item.product} - ${currentPrice}₪`);

      if (item.telegramId) {
        sendTelegramMessage(
          item.telegramId,
          `🔥 דיל שווה!\n📦 ${item.product}\n💰 מחיר: ${currentPrice}₪\n📉 ממוצע: ${avgPrice}₪\n🎯 יעד: ${item.targetPrice || "לא הוגדר"}`
        );
      }

      item.lastPrice = currentPrice;
    }
  }
}, 30000);

// 🚀 הפעלת השרת
app.get("/", (req, res) => {
  res.json({
    status: "🚀 PricePilot API is running",
    endpoints: [
      "/search?query=iphone",
      "/track (POST)",
      "/products"
    ]
  });
});
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
