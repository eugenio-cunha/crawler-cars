"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
class Resolver {
    static async run(query) {
        const urls = await this.filter(query);
        return (await Promise.all(urls.map(url => this.scrape(url)))).flat();
    }
    static async filter(query) {
        let urls = [];
        const page = await lib_1.Chromium.newPage();
        try {
            const { category, state, city, brand, model } = query;
            const url = `https://busca.autoline.com.br/comprar/${category}/novos-seminovos-usados/${state}/${city}/` +
                `${brand}/${model}/todas-as-versoes/todos-os-anos/todas-as-cores/todos-os-precos/?geoFilter=100`;
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            const length = await page.$eval('h3 > span.neemu-total-products-container > strong', e => {
                var _a, _b, _c;
                return parseInt(((_c = (_b = (_a = e.textContent) === null || _a === void 0 ? void 0 : _a.match(/\d+(\.|\,)?\d*/g)) === null || _b === void 0 ? void 0 : _b.shift()) === null || _c === void 0 ? void 0 : _c.replace(/\.|\,/g, '')) || '0', 10);
            });
            const pages = Math.round(length / 96);
            for (let i = 1; i <= pages; ++i) {
                urls.push(`${url}&results_per_page=96&page=${i}`);
            }
        }
        catch (error) {
            urls = [];
        }
        finally {
            await page.close();
        }
        return urls;
    }
    static async scrape(url) {
        let data;
        const page = await lib_1.Chromium.newPage();
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            const elements = await page.$$('.nm-product-item');
            data = await Promise.all(elements.map(e => this.miner(e)));
        }
        catch (error) {
            data = [];
        }
        finally {
            await page.close();
        }
        return data;
    }
    static async miner(element) {
        const result = await Promise.all([
            element.$eval('div.nm-features.nm-km', e => { var _a, _b; return ({ km: (_b = (_a = e.textContent) === null || _a === void 0 ? void 0 : _a.match(/\d+(\.|\,)?\d*/g)) === null || _b === void 0 ? void 0 : _b.shift() }); }),
            element.$eval('div.nm-features.nm-year', e => { var _a, _b; return ({ year: (_b = (_a = e.textContent) === null || _a === void 0 ? void 0 : _a.match(/\d+\/\d+/g)) === null || _b === void 0 ? void 0 : _b.shift() }); }),
            element.evaluate(e => {
                return {
                    category: e.getAttribute('data-category'),
                    brand: e.getAttribute('data-brand'),
                    state: e.getAttribute('data-state'),
                    city: e.getAttribute('data-city')
                };
            }),
            element.$eval('span.nm-request', e => {
                return {
                    src: `https:${e.getAttribute('alt')}`,
                    img: e.getAttribute('data-ad-image'),
                    name: e.getAttribute('data-ad-name'),
                    price: e.getAttribute('data-ad-price'),
                    model: e.getAttribute('data-ad-model')
                };
            })
        ]);
        return Object.assign({}, ...result);
    }
}
exports.default = Resolver;
//# sourceMappingURL=www.autoline.com.br.js.map