import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadscoregeneratorComponent } from './leadscoregenerator.component';

describe('LeadscoregeneratorComponent', () => {
  let component: LeadscoregeneratorComponent;
  let fixture: ComponentFixture<LeadscoregeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadscoregeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadscoregeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
