const express = require("express");
const timezoneRoutes = require("./routes/timezone");

const app = express();

app.use(express.json());

app.get("/api/test", (_, res) => {
  res.send({
    message: "API endpoint /test works!",
  });
});

app.use("/api/timezone", timezoneRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
