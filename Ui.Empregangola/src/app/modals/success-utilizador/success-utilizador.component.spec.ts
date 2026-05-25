import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessUtilizadorComponent } from './success-utilizador.component';

describe('SuccessUtilizadorComponent', () => {
  let component: SuccessUtilizadorComponent;
  let fixture: ComponentFixture<SuccessUtilizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessUtilizadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessUtilizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
