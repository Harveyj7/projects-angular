import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gbdp } from './gbdp';

describe('Gbdp', () => {
  let component: Gbdp;
  let fixture: ComponentFixture<Gbdp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gbdp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gbdp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
