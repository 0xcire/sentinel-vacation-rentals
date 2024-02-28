"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const routes_1 = require("../dist/routes");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../dist/swagger.json"));
const tsoa_1 = require("tsoa");
const http_error_1 = require("./lib/http-error");
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
(0, routes_1.RegisterRoutes)(app);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use(function notFoundHandler(_req, res) {
    res.status(404).send({
        message: "Not Found",
    });
});
app.use(function errorHandler(err, req, res, next) {
    if (err instanceof tsoa_1.ValidateError) {
        console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    if (err instanceof http_error_1.HTTPError) {
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
