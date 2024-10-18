import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/auth.dto';


describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            signUp: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signin', () => {
    it('should return an access token', async () => {
      const user = { email: 'test@example.com', password: 'testpassword' };
      const token = { access_token: 'testtoken' };
      jest.spyOn(authService, 'signIn').mockResolvedValue(token);

      const result = await controller.signIn(user) as SignInDto;

      expect(result).toEqual(token);
      expect(authService.signIn).toHaveBeenCalledWith(user);
    });
  });

  describe('signup', () => {
    it('should signUp a new user', async () => {
      const signUpDto = {
        id: 1,
        name: 'New User',
        email: 'newuser@example.com',
        password: 'newpassword',
        phone: '1234567890',
        birthday: '2025-01-01',
        gender: true,
        role: 'user',
      };
      const expectedResult = { id: 1, name: 'New User', email: 'newuser@example.com', phone: '1234567890', birthday: '2000-01-01', gender: true, role: 'user' };
      jest.spyOn(authService, 'signUp').mockResolvedValue(expectedResult);

      const result = await controller.signUp(signUpDto);

      expect(result).toEqual(expectedResult);
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto.email, signUpDto.password, signUpDto);
    });
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const user = { id: '1', username: 'testuser' };
      const req = { user } as any;
      const result = controller.getProfile(req);

      expect(result).toEqual(user);
    });
  });
});