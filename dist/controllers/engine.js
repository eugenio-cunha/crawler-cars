"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resolvers_1 = require("../resolvers");
class Engine {
    async search(req, res) {
        const { query } = req;
        const result = await Promise.all([
            resolvers_1.Autoline.run(query),
            resolvers_1.Icarros.run(query)
        ]);
        return res.json(result.flat());
    }
}
exports.default = new Engine();
//# sourceMappingURL=engine.js.map