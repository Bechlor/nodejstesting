
import express from "express"
const app = express();

const port = 9000;

app.get("/", (req, res) => {
  res.send("welcome home");
});

app.listen(port, () => {
  console.log(`Server is connected on port ${port}`);
});
