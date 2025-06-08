require("dotenv").config();
const express = require("express");
const cors = require("cors");
const timezoneRoutes = require("./routes/timezone");
const shiftsRoutes = require("./routes/shifts");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/api/test", (_, res) => {
  res.send({
    message: "API endpoint test!",
  });
});

app.use("/api/timezone", timezoneRoutes);
app.use("/api/shifts", shiftsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
