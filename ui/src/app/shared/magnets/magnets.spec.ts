import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Magnets } from './magnets';

describe('Magnets', () => {
  let component: Magnets;
  let fixture: ComponentFixture<Magnets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Magnets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Magnets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
