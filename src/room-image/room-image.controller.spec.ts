import { Test, TestingModule } from '@nestjs/testing';
import { RoomImageController } from './room-image.controller';

describe('RoomImageController', () => {
  let controller: RoomImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomImageController],
    }).compile();

    controller = module.get<RoomImageController>(RoomImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
