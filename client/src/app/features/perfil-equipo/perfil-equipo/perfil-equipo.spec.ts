import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilEquipo } from './perfil-equipo';

describe('PerfilEquipo', () => {
  let component: PerfilEquipo;
  let fixture: ComponentFixture<PerfilEquipo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilEquipo],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilEquipo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
