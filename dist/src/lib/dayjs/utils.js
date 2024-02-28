"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.differenceInDays = exports.endIsBeforeStart = exports.dateIsInvalid = exports.dateIsInThePast = exports.isBetween = void 0;
const _1 = __importDefault(require("."));
const isBetween = (target, start, end) => {
    return (0, _1.default)(target).isBetween((0, _1.default)(start), (0, _1.default)(end), "hour", "[]");
};
exports.isBetween = isBetween;
const dateIsInThePast = (comparison) => {
    return (0, _1.default)(comparison).isBefore((0, _1.default)());
};
exports.dateIsInThePast = dateIsInThePast;
const dateIsInvalid = (date) => {
    return date.toString() === "Invalid Date";
};
exports.dateIsInvalid = dateIsInvalid;
const endIsBeforeStart = (start, end) => {
    return (0, _1.default)(end).isBefore(start);
};
exports.endIsBeforeStart = endIsBeforeStart;
const differenceInDays = (start, end) => {
    return (0, _1.default)(end).diff((0, _1.default)(start), "days");
};
exports.differenceInDays = differenceInDays;
