"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
app_1.default.listen(process.env.HTTP_PORT || 3000, () => console.info(`(${process.env.NODE_ENV}) http://0.0.0.0:${process.env.HTTP_PORT}`));
//# sourceMappingURL=server.js.map