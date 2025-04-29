// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { Wallet } from './entities/wallet.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { ChainType } from './entities/chain-type.enum';

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('WalletsService', () => {
  let service: WalletsService;
  let walletRepository: MockRepository<Wallet>;
  let userRepository: MockRepository<any>;

  beforeEach(async () => {
    walletRepository = {
      insert: jest.fn(),
      findBy: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      save: jest.fn(),
    };

    userRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        {
          provide: getRepositoryToken(Wallet),
          useValue: walletRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a wallet successfully', async () => {
      const createWalletDto: CreateWalletDto = {
        address: '0x123',
        chain: ChainType.ETHEREUM,
        tag: 'Test',
      };
      const user: User = { id: 1, email: 'test@example.com' };

      walletRepository.insert.mockResolvedValue({ id: 1, ...createWalletDto });

      await service.create(user, createWalletDto);

      expect(walletRepository.save).toHaveBeenCalledWith({
        user,
        address: createWalletDto.address,
        chain: createWalletDto.chain,
        tag: createWalletDto.tag,
      });
    });
  });

  describe('findOne', () => {
    it('should return wallet details for a valid user', async () => {
      const user: User = { id: 1, email: 'test@example.com' };
      const wallet: Wallet = {
        id: 1,
        address: '0x123',
        chain: ChainType.ETHEREUM,
        tag: 'Test',
        user,
      };

      walletRepository.findOne.mockResolvedValue(wallet);

      const result = await service.findOne(user, 1);

      expect(result).toEqual({
        id: wallet.id,
        tag: wallet.tag,
        chain: wallet.chain,
        address: wallet.address,
      });
    });

    it('should throw NotFoundException when wallet does not exist', async () => {
      const user: User = { id: 1, email: 'test@example.com' };

      walletRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(user, 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException when wallet does not belong to the user', async () => {
      const user: User = { id: 2, email: 'test2@example.com' };
      const wallet: Wallet = {
        id: 1,
        address: '0x123',
        chain: ChainType.ETHEREUM,
        tag: 'Test',
        user: { id: 1 },
      };

      walletRepository.findOne.mockResolvedValue(wallet);

      await expect(service.findOne(user, 1)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('update', () => {
    it('should update wallet details for a valid user', async () => {
      const user: User = { id: 1, email: 'test@example.com' };
      const wallet: Wallet = {
        id: 1,
        address: '0x123',
        chain: ChainType.ETHEREUM,
        tag: 'Test',
        user,
      };
      const updateWalletDto: UpdateWalletDto = { tag: 'Updated Tag' };

      walletRepository.findOne.mockResolvedValue(wallet);
      walletRepository.update.mockResolvedValue({
        ...wallet,
        ...updateWalletDto,
      });

      await service.update(user, 1, updateWalletDto);

      expect(walletRepository.update).toHaveBeenCalledWith(
        { id: 1 },
        { ...updateWalletDto },
      );
    });

    it('should throw UnauthorizedException if wallet does not belong to the user', async () => {
      const user: User = { id: 2, email: 'test2@example.com' };
      const wallet: Wallet = {
        id: 1,
        address: '0x123',
        chain: ChainType.ETHEREUM,
        tag: 'Test',
        user: { id: 1 },
      };
      const updateWalletDto: UpdateWalletDto = { tag: 'Updated Tag' };

      walletRepository.findOne.mockResolvedValue(wallet);

      await expect(service.update(user, 1, updateWalletDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('remove', () => {
    it('should delete wallet successfully', async () => {
      const user: User = { id: 1, email: 'test@example.com' };
      const wallet: Wallet = {
        id: 1,
        address: '0x123',
        chain: ChainType.ETHEREUM,
        tag: 'Test',
        user,
      };

      walletRepository.findOne.mockResolvedValue(wallet);
      walletRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(user, 1);

      expect(walletRepository.delete).toHaveBeenCalledWith({ id: wallet.id });
    });

    it('should throw UnauthorizedException if wallet does not belong to the user', async () => {
      const user: User = { id: 2, email: 'test2@example.com' };
      const wallet: Wallet = {
        id: 1,
        address: '0x123',
        chain: ChainType.ETHEREUM,
        tag: 'Test',
        user: { id: 1 },
      };

      walletRepository.findOne.mockResolvedValue(wallet);

      await expect(service.remove(user, 1)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
