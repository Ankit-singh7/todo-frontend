import { TestBed } from '@angular/core/testing';

import { RouteGuardServiceService } from './route-guard-service.service';

describe('RouteGuardServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteGuardServiceService = TestBed.get(RouteGuardServiceService);
    expect(service).toBeTruthy();
  });
});
