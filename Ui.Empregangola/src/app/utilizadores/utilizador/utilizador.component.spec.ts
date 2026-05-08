import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilizadorComponent } from './utilizador.component';

describe('UtilizadorComponent', () => {
  let component: UtilizadorComponent;
  let fixture: ComponentFixture<UtilizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilizadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
