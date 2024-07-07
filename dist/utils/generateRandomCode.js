"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomCode = void 0;
const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
};
exports.generateRandomCode = generateRandomCode;
