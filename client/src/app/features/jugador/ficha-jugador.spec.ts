import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaJugador } from './ficha-jugador';

describe('FichaJugador', () => {
  let component: FichaJugador;
  let fixture: ComponentFixture<FichaJugador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichaJugador],
    }).compileComponents();

    fixture = TestBed.createComponent(FichaJugador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
