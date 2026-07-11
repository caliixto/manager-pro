import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Plantilla } from './plantilla';

describe('Plantilla', () => {
  let component: Plantilla;
  let fixture: ComponentFixture<Plantilla>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Plantilla],
    }).compileComponents();

    fixture = TestBed.createComponent(Plantilla);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
