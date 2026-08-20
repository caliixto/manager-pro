import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tacticas } from './tacticas';

describe('Tacticas', () => {
  let component: Tacticas;
  let fixture: ComponentFixture<Tacticas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tacticas],
    }).compileComponents();

    fixture = TestBed.createComponent(Tacticas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
