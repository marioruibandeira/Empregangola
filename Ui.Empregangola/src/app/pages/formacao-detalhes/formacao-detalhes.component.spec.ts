import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormacaoDetalhesComponent } from './formacao-detalhes.component';

describe('FormacaoDetalhesComponent', () => {
  let component: FormacaoDetalhesComponent;
  let fixture: ComponentFixture<FormacaoDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormacaoDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormacaoDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
