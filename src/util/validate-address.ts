import { ChainType } from '../wallets/entities/chain-type.enum';

export function validate(chain: ChainType, address: string) {
  if (chain === ChainType.ETHEREUM) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  if (chain === ChainType.BITCOIN) {
    return /^(1|3|bc1)[a-zA-Z0-9]{25,39}$/.test(address);
  }
  return false;
}
