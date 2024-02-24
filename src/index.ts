import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.listen(3000, () => {
  console.log("listening at http://localhost:3000");
});
