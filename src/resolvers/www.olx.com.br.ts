import { Page } from 'puppeteer';
import { Chromium } from '../lib';
import { Ad, Query } from '../types';

export default class Resolver {

  public static async run(query: Query): Promise<Ad[] | null> {
    const page = await Chromium.newPage();

    let result = null;

    try {
      await page.goto('https://www.olx.com.br/', { waitUntil: 'domcontentloaded' });

      // await this.setCategory(page, category);
      // await this.setPlace(page, place);
      // await this.setBrand(page, brand);
      // await this.setModel(page, model);
      // await this.search(page);

      result = await this.scrape(page);
    } catch (error) {
      console.error(error);
    } finally {
      await page.close();
    }

    return result;
  }

  private static async setCategory(page: Page, value: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private static async setPlace(page: Page, value: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private static async setBrand(page: Page, value: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private static async setModel(page: Page, value: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private static async search(page: Page): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private static async scrape(page: Page): Promise<any[]> | never {
    const result = [{ category: '', brand: '', model: '', place: '', url: '', km: 0, price: 0 }];

    return result;
  }
}
