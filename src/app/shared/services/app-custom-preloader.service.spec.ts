import { TestBed } from '@angular/core/testing';

import { AppCustomPreloaderService } from './app-custom-preloader.service';

describe('AppCustomPreloaderService', () => {
  let service: AppCustomPreloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppCustomPreloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
