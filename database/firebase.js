require("dotenv").config();
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "fc-itw-joenell",
});

const db = admin.firestore();

if (process.env.NODE_ENV === "development") {
  db.settings({
    host: process.env.FIRESTORE_EMULATOR_HOST,
    ssl: false,
  });
}

module.exports = db;
