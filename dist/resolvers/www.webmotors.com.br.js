"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
class Resolver {
    static async run(query) {
        const page = await lib_1.Chromium.newPage();
        let result = null;
        try {
            await page.goto('https://www.webmotors.com.br/', { waitUntil: 'domcontentloaded' });
            result = await this.scrape(page);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            await page.close();
        }
        return result;
    }
    static async setCategory(page, value) {
        throw new Error('Method not implemented.');
    }
    static async setPlace(page, value) {
        throw new Error('Method not implemented.');
    }
    static async setBrand(page, value) {
        throw new Error('Method not implemented.');
    }
    static async setModel(page, value) {
        throw new Error('Method not implemented.');
    }
    static async search(page) {
        throw new Error('Method not implemented.');
    }
    static async scrape(page) {
        const result = [{ category: '', brand: '', model: '', place: '', url: '', km: 0, price: 0 }];
        return result;
    }
}
exports.default = Resolver;
//# sourceMappingURL=www.webmotors.com.br.js.map