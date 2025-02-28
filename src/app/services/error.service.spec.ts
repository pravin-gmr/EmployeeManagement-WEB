import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';
import { ToastrModule } from 'ngx-toastr';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
    });
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
