const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("welcome to express...!");
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080....");
});
