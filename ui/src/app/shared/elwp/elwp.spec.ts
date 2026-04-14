import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Elwp } from './elwp';

describe('Elwp', () => {
  let component: Elwp;
  let fixture: ComponentFixture<Elwp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Elwp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Elwp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
