import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ChainType } from '../entities/chain-type.enum';
import { IsValidChainAddress } from '../validators/is-valid-chain-address.validator';

export class UpdateWalletDto {
  @IsOptional()
  tag?: string;

  @IsEnum(ChainType, {
    message: `chain must be one of the following: ${Object.values(ChainType).join(', ')}`,
  })
  chain: ChainType;

  @IsNotEmpty()
  @IsValidChainAddress()
  address: string;
}
