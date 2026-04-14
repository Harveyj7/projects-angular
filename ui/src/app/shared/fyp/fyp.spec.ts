import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fyp } from './fyp';

describe('Fyp', () => {
  let component: Fyp;
  let fixture: ComponentFixture<Fyp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fyp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fyp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
