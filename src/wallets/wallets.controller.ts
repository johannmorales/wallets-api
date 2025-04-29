import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { WalletDto } from './dto/wallet.dto';

@ApiBearerAuth('access-token')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Wallet successfully created' })
  create(@GetUser() user: User, @Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.create(user, createWalletDto);
  }

  @Get()
  @ApiOkResponse({ description: 'List all user wallets', type: [WalletDto] })
  findAll(@GetUser() user: User) {
    return this.walletsService.findAll(user);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get one wallet', type: WalletDto })
  @ApiNotFoundResponse({ description: 'Wallet not found' })
  @ApiUnauthorizedResponse({ description: 'Wallet doesnt belong to user' })
  findOne(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.walletsService.findOne(user, +id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Wallet updated successfully' })
  @ApiNotFoundResponse({ description: 'Wallet not found' })
  @ApiUnauthorizedResponse({ description: 'Wallet doesnt belong to user' })
  update(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return this.walletsService.update(user, +id, updateWalletDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Wallet deleted successfully' })
  @ApiNotFoundResponse({ description: 'Wallet not found' })
  @ApiUnauthorizedResponse({ description: 'Wallet doesnt belong to user' })
  remove(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.walletsService.remove(user, +id);
  }
}
