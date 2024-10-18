import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LocalGuard } from './local.guard';
import { AuthGuard } from '@nestjs/passport';

describe('LocalGuard', () => {
  let guard: LocalGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalGuard],
    }).compile();

    guard = module.get<LocalGuard>(LocalGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  // Thực hiện kiểm tra phương thức canActivate của LocalGuard có gọi đến phương thức canActivate của AuthGuard không
  it('should call super.canActivate', async () => {
    // Tạo mock ExecutionContext
    const context: ExecutionContext = {
      switchToHttp: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } as unknown as ExecutionContext;

    const canActivateSpy = jest.spyOn(AuthGuard('local').prototype, 'canActivate').mockReturnValue(true);

    const result = guard.canActivate(context);

    expect(canActivateSpy).toHaveBeenCalledWith(context);
    expect(result).toBe(true);
  });
});