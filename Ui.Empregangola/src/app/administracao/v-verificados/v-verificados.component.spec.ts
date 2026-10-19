import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VVerificadosComponent } from './v-verificados.component';

describe('VVerificadosComponent', () => {
  let component: VVerificadosComponent;
  let fixture: ComponentFixture<VVerificadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VVerificadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VVerificadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
