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
      const { state, city, brand, model } = query;
      const url = `https://www.icarros.com.br/comprar/${city}-${state}/${brand}/${model}`;
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const length = await page.$eval('#ctdoTitle > div > h1 > span', e => {
        return parseInt(e.textContent?.match(/\d+(\.|\,)?\d*/g)?.shift()?.replace(/\.|\,/g, '') || '0', 10);
      });

      const pages = Math.round(length / 20);
      for (let i = 1; i <= pages; ++i) {
        urls.push(`${url}&pag=${i}`);
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
      const elements = await page.$$('.anuncio_container');
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
        element.$eval('li.primeiro > p', e => ({ year: e.textContent?.replace(/\n\s*/g, '') })),
        element.$eval('div.clearfix > a > img.imglazy', e => ({ img: e.getAttribute('src') })),
        element.$eval('a.clearfix', e =>
        ({name: e.getAttribute('title'), src: `https://www.icarros.com.br/${e.getAttribute('href')}` })),
        element.$eval('a.clearfix > h2', e => ({ model: e.lastChild?.textContent?.replace(/\n/g, '').trim() })),
        element.$eval('a.clearfix > h2 > span > span', e => ({ brand: e.textContent })),
        element.$eval('a.clearfix > h3.direita', e => ({ price: e.textContent?.match(/\d+(\.|\,)?\d*/g)?.shift() })),
        element.$eval('a.clearfix > ul > li:nth-child(2) > p', e =>
        ({ km: e.textContent?.match(/\d+(\.|\,)?\d*/g)?.shift() })),
        element.$eval('div.dados_anunciante > p:nth-child(3) > span:nth-child(1)', e => ({ city: e.textContent })),
        element.$eval('div.dados_anunciante > p:nth-child(3) > span:nth-child(2)', e => ({ state: e.textContent }))
      ]
      );

    return Object.assign({}, ...result);
  }
}
