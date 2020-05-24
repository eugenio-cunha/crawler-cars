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
            const { state, city, brand, model } = query;
            const url = `https://www.icarros.com.br/comprar/${city}-${state}/${brand}/${model}`;
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            const length = await page.$eval('#ctdoTitle > div > h1 > span', e => {
                var _a, _b, _c;
                return parseInt(((_c = (_b = (_a = e.textContent) === null || _a === void 0 ? void 0 : _a.match(/\d+(\.|\,)?\d*/g)) === null || _b === void 0 ? void 0 : _b.shift()) === null || _c === void 0 ? void 0 : _c.replace(/\.|\,/g, '')) || '0', 10);
            });
            const pages = Math.round(length / 20);
            for (let i = 1; i <= pages; ++i) {
                urls.push(`${url}&pag=${i}`);
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
            const elements = await page.$$('.anuncio_container');
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
            element.$eval('li.primeiro > p', e => { var _a; return ({ year: (_a = e.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\n\s*/g, '') }); }),
            element.$eval('div.clearfix > a > img.imglazy', e => ({ img: e.getAttribute('src') })),
            element.$eval('a.clearfix', e => ({ name: e.getAttribute('title'), src: `https://www.icarros.com.br/${e.getAttribute('href')}` })),
            element.$eval('a.clearfix > h2', e => { var _a, _b; return ({ model: (_b = (_a = e.lastChild) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.replace(/\n/g, '').trim() }); }),
            element.$eval('a.clearfix > h2 > span > span', e => ({ brand: e.textContent })),
            element.$eval('a.clearfix > h3.direita', e => { var _a, _b; return ({ price: (_b = (_a = e.textContent) === null || _a === void 0 ? void 0 : _a.match(/\d+(\.|\,)?\d*/g)) === null || _b === void 0 ? void 0 : _b.shift() }); }),
            element.$eval('a.clearfix > ul > li:nth-child(2) > p', e => { var _a, _b; return ({ km: (_b = (_a = e.textContent) === null || _a === void 0 ? void 0 : _a.match(/\d+(\.|\,)?\d*/g)) === null || _b === void 0 ? void 0 : _b.shift() }); }),
            element.$eval('div.dados_anunciante > p:nth-child(3) > span:nth-child(1)', e => ({ city: e.textContent })),
            element.$eval('div.dados_anunciante > p:nth-child(3) > span:nth-child(2)', e => ({ state: e.textContent }))
        ]);
        return Object.assign({}, ...result);
    }
}
exports.default = Resolver;
//# sourceMappingURL=www.icarros.com.br.js.map