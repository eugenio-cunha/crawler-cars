"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Alive {
    ping(_, res) {
        return res.json({ ping: 'pong' });
    }
}
exports.default = new Alive();
//# sourceMappingURL=alive.js.map