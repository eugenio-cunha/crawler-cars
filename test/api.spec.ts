import { expect, should } from 'chai';
import app from '../src/app';
import { request } from '../src/lib';

const options = { host: '127.0.0.1', port: process.env.HTTP_PORT || '3000' };

describe('API', (): void => {
  before(done => {
    app.listen(options.port, (): void => {

      done();
    });
  });

  it('/ping', (done): void => {
    request({ ...options, path: '/ping' }, (err: any, res: any): void => {
      should().not.exist(err);

      expect(res).to.be.deep.equal({ code: 200, data: { ping: 'pong' } });
      done();
    });
  });

  it('/search', function(done): void {
    this.timeout(10000);

    request({ ...options, path: '/search?category=carro&brand=gm&model=s10&place=belo%20horizonte' },
      (err: any, res: any): void => {
      should().not.exist(err);

      const { code, data } = res;

      expect(code).to.be.equal(200);
      expect(data).to.be.instanceOf(Array);

      done();
    });
  });
});