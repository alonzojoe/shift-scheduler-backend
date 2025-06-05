const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "fc-itw-joenell",
});

const db = admin.firestore();

module.exports = db;
