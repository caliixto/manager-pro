import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Authmodal } from './authmodal';

describe('Authmodal', () => {
  let component: Authmodal;
  let fixture: ComponentFixture<Authmodal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Authmodal],
    }).compileComponents();

    fixture = TestBed.createComponent(Authmodal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
