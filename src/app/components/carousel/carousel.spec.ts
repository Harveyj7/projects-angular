import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carousel } from './carousel';

describe('Carousel', () => {
  let component: Carousel;
  let fixture: ComponentFixture<Carousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carousel],
    }).compileComponents();

    fixture = TestBed.createComponent(Carousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate 8 boxes', () => {
    const boxNumbers = component.getBoxNumbers();
    expect(boxNumbers.length).toBe(8);
    expect(boxNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
