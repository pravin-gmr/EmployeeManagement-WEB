import { TestBed } from '@angular/core/testing';
import { GetDataService } from './get-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('GetDataService', () => {
  let service: GetDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(GetDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
