import { expect, should } from 'chai';
import { Chromium } from '../src/lib';

describe('Chromium', (): void => {
  it('isConnected()', async (): Promise<void> => {
    expect(await Chromium.isConnected()).to.be.equal(true);
  });
});