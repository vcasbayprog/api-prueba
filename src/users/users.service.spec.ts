import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const mockUserModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ username: 'test', password: 'test', role: 'user' }];
      jest.spyOn(model, 'find').mockResolvedValue(result as any);

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findById', () => {
    it('should return a user', async () => {
      const result = { username: 'test', password: 'test', role: 'user' };
      jest.spyOn(model, 'findById').mockResolvedValue(result as any);

      expect(await service.findById('1')).toEqual(result);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = { username: 'test', password: 'test', role: 'user' };
      jest.spyOn(model, 'create').mockResolvedValue(createUserDto as any);

      expect(await service.create(createUserDto)).toEqual(createUserDto);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = { username: 'updated', password: 'updated', role: 'user' };
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updateUserDto as any);

      expect(await service.update('1', updateUserDto)).toEqual(updateUserDto);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue({} as any);

      await service.remove('1');
      expect(model.findByIdAndDelete).toHaveBeenCalledWith('1');
    });
  });
});
