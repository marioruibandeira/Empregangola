import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovasVagasComponent } from './novas-vagas.component';

describe('NovasVagasComponent', () => {
  let component: NovasVagasComponent;
  let fixture: ComponentFixture<NovasVagasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NovasVagasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovasVagasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
