import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

import { RegisterRoutes } from "../dist/routes";
import swaggerUi from "swagger-ui-express";
import docs from "../dist/swagger.json";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

RegisterRoutes(app);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(docs));

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
