import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { AuthException } from './exceptions/auth.exception';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verifyAsync: jest.fn() },
        },
        {
          provide: 'Logger',
          useValue: { error: jest.fn(), info: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    logger = module.get<Logger>('Logger');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should return an access token when credentials are valid', async () => {
      const signInDto: SignInDto = { email: 'test@example.com', password: 'testpassword' };
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
      const token = 'testtoken';

      jest.spyOn(service as any, 'findUserByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await service.signIn(signInDto);

      expect(result).toEqual({ access_token: token });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: user.email, sub: user.id });
    });

    it('should throw AuthException when credentials are invalid', async () => {
      const signInDto: SignInDto = { email: 'test@example.com', password: 'wrongpassword' };
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };

      jest.spyOn(service as any, 'findUserByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(AuthException);
    });
  });

  describe('signUp', () => {
    it('should create a new user and return user data without password', async () => {
      const signUpDto: SignUpDto = {
        id: 0,
        name: 'Test User',
        email: 'newuser@example.com',
        password: 'newpassword',
        phone: '1234567890',
        birthday: '1990-01-01',
        gender: true,
        role: 'USER'
      };
      const hashedPassword = 'hashedPassword';
      const createdUser = { ...signUpDto, id: 1, password: hashedPassword };

      jest.spyOn(service as any, 'findUserByEmail').mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      jest.spyOn(service as any, 'createUser').mockResolvedValue(createdUser);

      const result = await service.signUp(signUpDto);

      expect(result).toEqual({ ...createdUser, password: undefined });
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
    });

    it('should throw AuthException when user already exists', async () => {
      const signUpDto: SignUpDto = {
        id: 0,
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'password',
        phone: '1234567890',
        birthday: '1990-01-01',
        gender: true,
        role: 'USER'
      };

      jest.spyOn(service as any, 'findUserByEmail').mockResolvedValue({ id: 1 });

      await expect(service.signUp(signUpDto)).rejects.toThrow(AuthException);
    });
  });

  describe('validateUser', () => {
    it('should return user without password if validation succeeds', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const user = { id: 1, email, password: 'hashedPassword' };

      jest.spyOn(service as any, 'findUserByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(result).toEqual({ id: 1, email });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(service as any, 'findUserByEmail').mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'testpassword');

      expect(result).toBeNull();
    });
  });

  describe('verifyToken', () => {
    it('should return payload when token is valid', async () => {
      const token = 'validtoken';
      const payload = { email: 'test@example.com', sub: 1 };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

      const result = await service.verifyToken(token);

      expect(result).toEqual(payload);
    });

    it('should throw AuthException when token is invalid', async () => {
      const token = 'invalidtoken';

      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'));

      await expect(service.verifyToken(token)).rejects.toThrow(AuthException);
    });
  });
});