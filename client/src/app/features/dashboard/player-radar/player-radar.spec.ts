import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerRadar } from './player-radar';

describe('PlayerRadar', () => {
  let component: PlayerRadar;
  let fixture: ComponentFixture<PlayerRadar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerRadar],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerRadar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
