import { Chromium } from '../lib';
import { Ad, Query } from '../types';
import { ElementHandle } from 'puppeteer';

export default class Resolver {

  public static async run(query: Query): Promise<any> {
    const urls = await this.filter(query);
    return (await Promise.all(urls.map(url => this.scrape(url)))).flat();
  }

  private static async filter(query: Query): Promise<string[]> {
    let urls = [];
    const page = await Chromium.newPage();

    try {
      const { category, state, city, brand, model } = query;
      const url = `https://busca.autoline.com.br/comprar/${category}/novos-seminovos-usados/${state}/${city}/` +
        `${brand}/${model}/todas-as-versoes/todos-os-anos/todas-as-cores/todos-os-precos/?geoFilter=100`;
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const length = await page.$eval('h3 > span.neemu-total-products-container > strong', e => {
        return parseInt(e.textContent?.match(/\d+(\.|\,)?\d*/g)?.shift()?.replace(/\.|\,/g, '') || '0', 10);
      });
      const pages = Math.round(length / 96);
      for (let i = 1; i <= pages; ++i) {
        urls.push(`${url}&results_per_page=96&page=${i}`);
      }
    } catch (error) {
      urls = [];
    } finally {
      await page.close();
    }

    return urls;
  }

  private static async scrape(url: any): Promise<null | Ad[]> {
    let data: any[];
    const page = await Chromium.newPage();

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      const elements = await page.$$('.nm-product-item');
      data = await Promise.all(elements.map(e => this.miner(e)));
    } catch (error) {
      data = [];
    } finally {
      await page.close();
    }

    return data;
  }

  private static async miner(element: ElementHandle): Promise<null | Ad[]> {
    const result = await Promise.all(
      [
        element.$eval('div.nm-features.nm-km', e => ({ km: e.textContent?.match(/\d+(\.|\,)?\d*/g)?.shift() })),
        element.$eval('div.nm-features.nm-year', e => ({ year: e.textContent?.match(/\d+\/\d+/g)?.shift() })),
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
      ]
    );
    return Object.assign({}, ...result);
  }
}
