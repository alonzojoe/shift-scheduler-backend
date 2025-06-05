const express = require("express");
const router = express.Router();
const db = require("../database/firebase");
const moment = require("moment-timezone");
const validateShift = require("../utils/libs");

const shiftsCollection = db.collection("shifts");

router.get("/", async (req, res) => {
  try {
    const timezone = req.query.timezone;

    const shifts = await shiftsCollection.orderBy("start").get();

    const shiftsData = shifts.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        rawStart: data.start,
        rawEnd: data.end,
        start: moment
          .utc(data.start)
          .tz(timezone)
          .format("MMMM D, YYYY — hh:mm A"),
        end: moment.utc(data.end).tz(timezone).format("MMMM D, YYYY — hh:mm A"),
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
    const { start, end, timezone } = req.body;

    if (!start || !end || !timezone) {
      return res
        .status(400)
        .json({ error: "Start, end datetime and timezone are required!" });
    }

    const utcStart = moment.tz(start, timezone).utc().toISOString();
    const utcEnd = moment.tz(end, timezone).utc().toISOString();

    const shifts = await shiftsCollection.get();
    const existingShifts = shifts.docs.map((doc) => doc.data());

    const errorMessage = validateShift(
      { start: utcStart, end: utcEnd },
      existingShifts
    );

    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    const duration = moment(utcEnd).diff(moment(utcStart), "hours", true);

    const newShift = await shiftsCollection.add({
      start: utcStart,
      end: utcEnd,
      duration,
    });

    res.status(201).json({
      message: "Shift created successfully",
      data: { id: newShift.id, start: utcStart, end: utcEnd, duration },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end, timezone } = req.body;

    if (!start || !end || !timezone) {
      return res
        .status(400)
        .json({ error: "Start, end datetime and timezone are required!" });
    }

    const utcStart = moment.tz(start, timezone).utc().toISOString();
    const utcEnd = moment.tz(end, timezone).utc().toISOString();

    const shifts = await shiftsCollection.get();
    const existingShifts = shifts.docs
      .filter((doc) => doc.id !== id)
      .map((doc) => doc.data());

    const errorMessage = validateShift(
      { start: utcStart, end: utcEnd },
      existingShifts
    );

    if (errorMessage) {
      return res.status(400).json({ error: errorMessage });
    }

    const duration = moment(utcEnd).diff(moment(utcStart), "hours", true);

    await shiftsCollection
      .doc(id)
      .update({ start: utcStart, end: utcEnd, duration });

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
