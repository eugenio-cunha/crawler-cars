"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("./controllers");
const routes = express_1.Router();
routes.get('/search', controllers_1.Engine.search);
routes.get('/ping', controllers_1.Alive.ping);
exports.default = routes;
//# sourceMappingURL=routes.js.map