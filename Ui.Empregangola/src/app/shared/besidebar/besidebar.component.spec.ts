import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BesidebarComponent } from './besidebar.component';

describe('BesidebarComponent', () => {
  let component: BesidebarComponent;
  let fixture: ComponentFixture<BesidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BesidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BesidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
