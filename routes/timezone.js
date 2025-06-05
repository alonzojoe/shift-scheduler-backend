const express = require("express");
const router = express.Router();
const db = require("../database/firebase");

router.get("/", async (req, res) => {
  try {
    const docRef = db.collection("settings").doc("timezone");
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Timezone not set" });
    }

    res.status(200).json({ timezone: doc.data().timezone });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const { timezone } = req.body;

    if (!timezone) {
      return res.status(400).json({ error: "Timezone is required" });
    }

    const docRef = db.collection("settings").doc("timezone");

    await docRef.set({ timezone }, { merge: true });

    res
      .status(200)
      .json({ message: "Timezone updated successfully", timezone });
  } catch (error) {
    res.status(500).json({ error: error?.message });
  }
});

module.exports = router;
