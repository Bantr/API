import { Test, TestingModule } from '@nestjs/testing';

import { UserSettingsRepository } from './user-settings.repository';
import { UserSettingsService } from './user-settings.service';

describe('UserSettingsService', () => {
  let service: UserSettingsService;

  const mockUserSettingsRepository = () => ({
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSettingsService,
        { provide: UserSettingsRepository, useFactory: mockUserSettingsRepository }
      ]
    }).compile();

    service = module.get<UserSettingsService>(UserSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
