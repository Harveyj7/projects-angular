import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Matlab } from './matlab';

describe('Matlab', () => {
  let component: Matlab;
  let fixture: ComponentFixture<Matlab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Matlab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Matlab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
