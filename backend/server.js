const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 נתונים זמניים (בהמשך יהיה DB)
let products = [];

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

// 🔹 הפעלת השרת
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
