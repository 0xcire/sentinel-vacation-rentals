"use strict";
// from my Propel CRM project
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPError = void 0;
// ref: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
// http status implementation is my own
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class HTTPError extends Error {
    code;
    message;
    cause;
    constructor(opts) {
        super(opts.message);
        const proto = new.target.prototype;
        Object.setPrototypeOf(this, proto);
        this.name = proto.constructor.name;
        this.code = http_status_codes_1.default[opts.code];
        this.message = opts.message;
    }
}
exports.HTTPError = HTTPError;
