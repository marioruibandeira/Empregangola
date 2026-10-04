import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroFormacaoComponent } from './centro-formacao.component';

describe('CentroFormacaoComponent', () => {
  let component: CentroFormacaoComponent;
  let fixture: ComponentFixture<CentroFormacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentroFormacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentroFormacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
