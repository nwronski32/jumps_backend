import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ Jumps backend is running!");
});

let tokens = [];

app.post("/register", express.json(), (req, res) => {
  const { token } = req.body;
  if (token && !tokens.includes(token)) {
    tokens.push(token);
    console.log("Registered token:", token);
  }
  res.json({ success: true });
});


// POST endpoint to send notifications
app.post("/send", async (req, res) => {
  const { tokens, message } = req.body;

  if (!tokens || tokens.length === 0) {
    return res.status(400).json({ error: "No tokens provided" });
  }

  const payloads = tokens.map((token) => ({
    to: token,
    sound: "default",
    title: "Big Mo’s Jumps",
    body: message || "New alert!",
  }));

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloads),
    });

    const data = await response.json();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
