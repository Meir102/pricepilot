const express = require("express");
const app = express();

app.use(express.json());

// דאטה זמני
let products = [];

app.get("/products", (req, res) => {
  res.json(products);
});

app.post("/products", (req, res) => {
  const product = {
    id: Date.now(),
    ...req.body,
  };

  products.push(product);

  res.json({ success: true, product });
});

// חשוב מאוד - פתוח לכל המכשיר
app.listen(5000, "0.0.0.0", () => {
  console.log("Backend running on port 5000");
});
