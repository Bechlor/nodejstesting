import express from "express";
import cors from "cors";
import "dotenv/config";
import { intializeRoute } from "./routes/commonRoutes.js";
const app = express();

const PORT = process.env.PORT || 9000;
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
intializeRoute(app);

app.get("/", (req, res) => {
  res.send("welcome home");
});

app.listen(PORT, () => {
  console.log(`Server is connected on port ${PORT}`);
});
