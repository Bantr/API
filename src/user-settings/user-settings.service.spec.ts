import { HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { UserSettingsRepository } from './user-settings.repository';
import { UserSettingsService } from './user-settings.service';

describe("UserSettingsService", () => {
  let service: UserSettingsService;

  const mockUserSettingsRepository = () => ({});

  const mockHttpService = {};
  const mockConfigService = {
    get: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSettingsService,
        {
          provide: UserSettingsRepository,
          useFactory: mockUserSettingsRepository
        },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compile();

    service = module.get<UserSettingsService>(UserSettingsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
