import { Browser, BrowserContext, devices, launch, Page } from 'puppeteer';

export default class Chromium {

  private static instance: Chromium;
  private browser: Browser;
  private context: BrowserContext;

  private constructor(browser: Browser, context: BrowserContext) {
    this.browser = browser;
    this.context = context;
  }

  private static async interception(page: Page): Promise<void> {
    await page.setRequestInterception(true);

    page.on('request', (req): void => {
      const url = req.url();
      const resource = req.resourceType();
      if ((resource !== 'document' && resource !== 'script') ||
          url.includes('google') ||
          url.includes('facebook') ||
          url.includes('twitter')) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  private static async getInstance(): Promise<Chromium> {
    if (!Chromium.instance) {
      const options = {
        args: [
          '--no-sandbox',
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

      const browser = await launch(options);
      const context = await browser.createIncognitoBrowserContext();
      Chromium.instance = new Chromium(browser, context);
    }
    return Chromium.instance;
  }

  public static async newPage(): Promise<Page> {
    const { context } = await this.getInstance();
    const page = await context.newPage();

    await this.interception(page);

    return page;
  }

  public static async isConnected(): Promise<boolean> {
    const { browser } = await this.getInstance();
    return browser.isConnected();
  }
}