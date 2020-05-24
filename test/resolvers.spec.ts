import { should } from 'chai';
import { Query} from '../src/types';
import { Autoline, Icarros, MercadoLivre, OLX, Webmotors } from '../src/resolvers';

describe('Resolvers', (): void => {
  let query: Query;
  before(async function(): Promise<void> {
    query = { category: 'carros', state: 'sp', city: 'sao-paulo', brand: 'fiat', model: 'uno' };
  });

  it('www.autoline.com.br', async function(): Promise<void> {
    this.timeout(60000);

    const result = await Autoline.run(query);

    should().exist(result);
  });

  it('www.icarros.com.br', async function(): Promise<void> {
    this.timeout(60000);

    const result = await Icarros.run(query);

    should().exist(result);
  });

  it.skip('www.mercadolivre.com.br', async function(): Promise<void> {
    this.timeout(10000);

    const result = await MercadoLivre.run(query);

    should().exist(result);
  });

  it.skip('www.olx.com.br', async function(): Promise<void> {
    this.timeout(10000);

    const result = await OLX.run(query);
    should().exist(result);
  });

  it.skip('www.webmotors.com.br', async function(): Promise<void> {
    this.timeout(10000);

    const result = await Webmotors.run(query);
    should().exist(result);
  });
});