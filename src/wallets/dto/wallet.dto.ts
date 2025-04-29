import { ChainType } from '../entities/chain-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WalletDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  tag?: string;

  @ApiProperty()
  chain: ChainType;

  @ApiProperty()
  address: string;
}
