import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { ShaadiService } from './shaadi.service';
import { Shaadi, ShaadiDocument } from './shaadi.schema';
import { Invite, InviteDocument } from './invite.schema';
import { ShaadiMember, ShaadiMemberDocument } from './shaadi-member.schema';
import { Model } from 'mongoose';

describe('ShaadiService', () => {
  let service: ShaadiService;
  let shaadiModel: Model<ShaadiDocument>;
  let inviteModel: Model<InviteDocument>;
  let shaadiMemberModel: Model<ShaadiMemberDocument>;

  const mockShaadiModel = {
    findById: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  };

  const mockInviteModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
  };

  const mockShaadiMemberModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShaadiService,
        {
          provide: getModelToken(Shaadi.name),
          useValue: mockShaadiModel,
        },
        {
          provide: getModelToken(Invite.name),
          useValue: mockInviteModel,
        },
        {
          provide: getModelToken(ShaadiMember.name),
          useValue: mockShaadiMemberModel,
        },
      ],
    }).compile();

    service = module.get<ShaadiService>(ShaadiService);
    shaadiModel = module.get<Model<ShaadiDocument>>(getModelToken(Shaadi.name));
    inviteModel = module.get<Model<InviteDocument>>(getModelToken(Invite.name));
    shaadiMemberModel = module.get<Model<ShaadiMemberDocument>>(getModelToken(ShaadiMember.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createInvite', () => {
    const mockShaadiId = '507f1f77bcf86cd799439011';
    const mockUserId = '507f1f77bcf86cd799439012';
    const mockInviteData = {
      guestEmail: 'test@example.com',
      guestPhone: '1234567890',
      guestName: 'Test Guest',
      relationship: 'Friend',
      side: 'bride',
      message: 'Please join us!',
    };

    it('should create an invite successfully', async () => {
      // Mock shaadi exists and user is creator
      const mockShaadi = {
        _id: mockShaadiId,
        brideName: 'Bride',
        groomName: 'Groom',
        weddingDate: new Date(),
        venue: 'Test Venue',
        createdBy: mockUserId,
      };
      mockShaadiModel.findById.mockResolvedValue(mockShaadi);

      // Mock creator membership
      mockShaadiMemberModel.findOne.mockResolvedValue({
        userId: mockUserId,
        role: 'creator',
        shaadiId: mockShaadiId,
      });

      // Mock no existing invite code
      mockInviteModel.findOne.mockResolvedValue(null);

      // Mock successful invite save
      const mockInvite = {
        _id: 'invite123',
        inviteCode: '123456',
        inviteLink: 'http://localhost:5173/join?code=123456',
        ...mockInviteData,
        shaadiId: mockShaadiId,
        createdBy: mockUserId,
        status: 'pending',
        expiresAt: expect.any(Date),
        save: jest.fn().mockResolvedValue(true),
      };
      mockInviteModel.create.mockReturnValue(mockInvite);

      const result = await service.createInvite(mockShaadiId, mockUserId, mockInviteData);

      expect(result).toBeDefined();
      expect(result.inviteCode).toHaveLength(6);
      expect(result.inviteLink).toContain(result.inviteCode);
      expect(result.guestEmail).toBe(mockInviteData.guestEmail);
      expect(mockInviteModel.findOne).toHaveBeenCalledWith({ inviteCode: expect.any(String) });
      expect(mockInvite.save).toHaveBeenCalled();
    });

    it('should throw error if shaadi not found', async () => {
      mockShaadiModel.findById.mockResolvedValue(null);

      await expect(service.createInvite(mockShaadiId, mockUserId, mockInviteData))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw error if user is not creator', async () => {
      const mockShaadi = {
        _id: mockShaadiId,
        createdBy: 'different-user-id',
      };
      mockShaadiModel.findById.mockResolvedValue(mockShaadi);

      await expect(service.createInvite(mockShaadiId, mockUserId, mockInviteData))
        .rejects.toThrow(BadRequestException);
    });

    it('should retry if duplicate code is generated', async () => {
      const mockShaadi = {
        _id: mockShaadiId,
        createdBy: mockUserId,
      };
      mockShaadiModel.findById.mockResolvedValue(mockShaadi);

      // Mock creator membership
      mockShaadiMemberModel.findOne.mockResolvedValue({
        userId: mockUserId,
        role: 'creator',
        shaadiId: mockShaadiId,
      });

      // Mock first code exists, second code is unique
      mockInviteModel.findOne
        .mockResolvedValueOnce({ inviteCode: '123456' }) // First attempt: code exists
        .mockResolvedValueOnce(null); // Second attempt: code is unique

      const mockInvite = {
        _id: 'invite123',
        inviteCode: '789012',
        inviteLink: 'http://localhost:5173/join?code=789012',
        ...mockInviteData,
        shaadiId: mockShaadiId,
        createdBy: mockUserId,
        status: 'pending',
        expiresAt: expect.any(Date),
        save: jest.fn().mockResolvedValue(true),
      };
      mockInviteModel.create.mockReturnValue(mockInvite);

      const result = await service.createInvite(mockShaadiId, mockUserId, mockInviteData);

      expect(result).toBeDefined();
      expect(mockInviteModel.findOne).toHaveBeenCalledTimes(2);
    });

    it('should throw error after max attempts for unique code', async () => {
      const mockShaadi = {
        _id: mockShaadiId,
        createdBy: mockUserId,
      };
      mockShaadiModel.findById.mockResolvedValue(mockShaadi);

      // Mock all attempts return existing code
      mockInviteModel.findOne.mockResolvedValue({ inviteCode: '123456' });

      await expect(service.createInvite(mockShaadiId, mockUserId, mockInviteData))
        .rejects.toThrow(BadRequestException);
    });

    it('should handle database save errors', async () => {
      const mockShaadi = {
        _id: mockShaadiId,
        createdBy: mockUserId,
      };
      mockShaadiModel.findById.mockResolvedValue(mockShaadi);
      mockInviteModel.findOne.mockResolvedValue(null);

      const mockInvite = {
        save: jest.fn().mockRejectedValue(new Error('Database error')),
      };
      mockInviteModel.create.mockReturnValue(mockInvite);

      await expect(service.createInvite(mockShaadiId, mockUserId, mockInviteData))
        .rejects.toThrow(BadRequestException);
    });

    it('should handle duplicate key error during save', async () => {
      const mockShaadi = {
        _id: mockShaadiId,
        createdBy: mockUserId,
      };
      mockShaadiModel.findById.mockResolvedValue(mockShaadi);
      mockInviteModel.findOne.mockResolvedValue(null);

      const duplicateKeyError = new Error('Duplicate key');
      (duplicateKeyError as any).code = 11000;
      
      const mockInvite = {
        save: jest.fn().mockRejectedValue(duplicateKeyError),
      };
      mockInviteModel.create.mockReturnValue(mockInvite);

      await expect(service.createInvite(mockShaadiId, mockUserId, mockInviteData))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getInvites', () => {
    const mockShaadiId = '507f1f77bcf86cd799439011';
    const mockUserId = '507f1f77bcf86cd799439012';

    it('should return invites for a shaadi', async () => {
      // Mock creator membership
      mockShaadiMemberModel.findOne.mockResolvedValue({
        userId: mockUserId,
        role: 'creator',
        shaadiId: mockShaadiId,
      });

      const mockInvites = [
        {
          _id: 'invite1',
          inviteCode: '123456',
          guestEmail: 'guest1@example.com',
          guestName: 'Guest 1',
          status: 'pending',
        },
        {
          _id: 'invite2',
          inviteCode: '789012',
          guestEmail: 'guest2@example.com',
          guestName: 'Guest 2',
          status: 'accepted',
        },
      ];

      mockInviteModel.find.mockResolvedValue(mockInvites);

      const result = await service.getInvites(mockShaadiId, mockUserId);

      expect(result).toEqual(mockInvites);
      expect(mockInviteModel.find).toHaveBeenCalledWith({ shaadiId: mockShaadiId });
    });

    it('should return empty array when no invites exist', async () => {
      // Mock creator membership
      mockShaadiMemberModel.findOne.mockResolvedValue({
        userId: mockUserId,
        role: 'creator',
        shaadiId: mockShaadiId,
      });

      mockInviteModel.find.mockResolvedValue([]);

      const result = await service.getInvites(mockShaadiId, mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('generateInviteCode', () => {
    it('should generate a 6-digit code', () => {
      const code = service['generateInviteCode']();
      
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^\d{6}$/);
    });

    it('should generate different codes on multiple calls', () => {
      const codes = new Set();
      
      for (let i = 0; i < 10; i++) {
        const code = service['generateInviteCode']();
        codes.add(code);
      }
      
      expect(codes.size).toBe(10);
    });
  });
}); 