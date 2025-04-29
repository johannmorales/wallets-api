import { validate } from './validate-address';
import { ChainType } from '../wallets/entities/chain-type.enum';

describe('validate', () => {
  it('should validate a correct Ethereum address', () => {
    const chain = ChainType.ETHEREUM;
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    expect(validate(chain, address)).toBe(true);
  });

  it('should invalidate an incorrect Ethereum address', () => {
    const chain = ChainType.ETHEREUM;
    const address = '0x12345';
    expect(validate(chain, address)).toBe(false);
  });

  it('should validate a correct Bitcoin address', () => {
    const chain = ChainType.BITCOIN;
    const address = '1BoatSLRHtKNngkdXEeobR76b53LETtpyT';
    expect(validate(chain, address)).toBe(true);
  });

  it('should invalidate an incorrect Bitcoin address', () => {
    const chain = ChainType.BITCOIN;
    const address = 'invalidbitcoinaddress';
    expect(validate(chain, address)).toBe(false);
  });

  it('should return false for unsupported chain types', () => {
    const chain = 'UNSUPPORTED' as any;
    const address = 'someaddress';
    expect(validate(chain, address)).toBe(false);
  });
});
