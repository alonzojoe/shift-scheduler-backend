const express = require("express");
const router = express.Router();
const db = require("../database/firebase");
const moment = require("moment-timezone");
const validateShift = require("../utils/libs");

const shiftsCollection = db.collection("shifts");

let timezone = "UTC";

(async () => {
  const settingsDoc = await db.collection("settings").doc("timezone").get();
  if (settingsDoc.exists && settingsDoc.data().timezone) {
    timezone = settingsDoc.data().timezone;
    console.log("Timezone loaded:", timezone);
  }
})();

router.get("/", async (req, res) => {
  try {
    const shifts = await shiftsCollection.orderBy("start").get();

    const shiftsData = shifts.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        start: moment.utc(data.start).tz(timezone).format(),
        end: moment.utc(data.end).tz(timezone).format(),
        duration: data.duration,
      };
    });

    res.status(200).json(shiftsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { start, end } = req.body;
    if (!start || !end) {
      return res
        .status(400)
        .json({ error: "Start and end datetime are required!" });
    }

    const shifts = await shiftsCollection.get();
    const existingShifts = shifts.docs.map((doc) => doc.data());

    const errorMessage = validateShift({ start, end }, existingShifts);

    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    const duration = moment(end).diff(moment(start), "hours", true);

    const newShift = await shiftsCollection.add({
      start,
      end,
      duration,
    });

    res.status(201).json({
      message: "Shift created successfully",
      data: { id: newShift.id, start, end, duration },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end } = req.body;

    if (!start || !end) {
      return res
        .status(400)
        .json({ error: "Start and end datetime are required!" });
    }

    const shifts = await shiftsCollection.get();
    const existingShifts = shifts.docs
      .filter((doc) => doc.id !== id)
      .map((doc) => doc.data());

    const errorMessage = validateShift({ start, end }, existingShifts);

    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    const duration = moment(end).diff(moment(start), "hours", true);

    await shiftsCollection.doc(id).update({ start, end, duration });

    const updatedShift = await shiftsCollection.doc(id).get();

    res.status(200).json({
      message: "Shift updated successfully",
      data: updatedShift.data(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await shiftsCollection.doc(id).delete();
    res.status(200).json({ message: "Shift deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
