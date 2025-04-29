import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,
  ) {}

  async create(user: User, dto: CreateWalletDto) {
    const wallet = new Wallet();
    wallet.user = user;
    wallet.address = dto.address;
    wallet.chain = dto.chain;
    wallet.tag = dto.tag;
    await this.walletsRepository.save(wallet);
    return wallet;
  }

  findAll(user: User) {
    return this.walletsRepository.findBy({
      user,
    });
  }

  async verifyWalletBelongsToUser(walletId: number, user: User) {
    const wallet = await this.walletsRepository.findOne({
      where: { id: walletId },
      relations: ['user'],
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.user.id !== user.id) {
      throw new UnauthorizedException('Not authorized to delete this wallet');
    }

    return wallet;
  }

  async findOne(user: User, id: number) {
    const wallet = await this.verifyWalletBelongsToUser(id, user);
    const dto = {
      id: wallet.id,
      tag: wallet.tag,
      chain: wallet.chain,
      address: wallet.address,
    };

    return dto;
  }

  async update(user: User, id: number, updateWalletDto: UpdateWalletDto) {
    const wallet = await this.verifyWalletBelongsToUser(id, user);
    await this.walletsRepository.update(
      {
        id: wallet.id,
      },
      {
        ...updateWalletDto,
      },
    );
  }

  async remove(user: User, id: number) {
    const wallet = await this.verifyWalletBelongsToUser(id, user);
    await this.walletsRepository.delete({ id: wallet.id });
  }
}
