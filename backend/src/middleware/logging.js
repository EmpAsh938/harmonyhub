"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
};
exports.default = logging;
