const express = require("express");

const app = express();

app.use(express.json());

app.get("/test", (_, res) => {
  res.send({
    message: "API endpoint /test works!",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
