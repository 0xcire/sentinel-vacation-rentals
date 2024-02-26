import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

import { RegisterRoutes } from "../dist/routes";
import swaggerUi from "swagger-ui-express";
import docs from "../dist/swagger.json";

import { ValidateError } from "tsoa";
import { HTTPError } from "./lib/http-error";

import type { Request, Response, NextFunction } from "express";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

RegisterRoutes(app);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(docs));

app.use(function notFoundHandler(_req, res: Response) {
  res.status(404).send({
    message: "Not Found",
  });
});

app.use(function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): Response | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }

  if (err instanceof HTTPError) {
    return res.status(err.code).json({
      message: err.message,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
