"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
class Chromium {
    constructor(browser, context) {
        this.browser = browser;
        this.context = context;
    }
    static async interception(page) {
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            const url = req.url();
            const resource = req.resourceType();
            if ((resource !== 'document' && resource !== 'script') ||
                url.includes('google') ||
                url.includes('facebook') ||
                url.includes('twitter')) {
                req.abort();
            }
            else {
                req.continue();
            }
        });
    }
    static async getInstance() {
        if (!Chromium.instance) {
            const options = {
                args: [
                    '--disable-gpu',
                    '--disable-notifications',
                    '--disable-checker-imaging',
                    '--ignore-certificate-errors',
                    '--disable-accelerated-2d-canvas'
                ],
                ignoreHTTPSErrors: true,
                userDataDir: '/tmp/chromium',
                headless: process.env.HEADLESS === 'false' ? false : true
            };
            const browser = await puppeteer_1.launch(options);
            const context = await browser.createIncognitoBrowserContext();
            Chromium.instance = new Chromium(browser, context);
        }
        return Chromium.instance;
    }
    static async newPage() {
        const { context } = await this.getInstance();
        const page = await context.newPage();
        await this.interception(page);
        return page;
    }
    static async isConnected() {
        const { browser } = await this.getInstance();
        return browser.isConnected();
    }
}
exports.default = Chromium;
//# sourceMappingURL=chromium.js.map