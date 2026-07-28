import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocatoriaDetalle } from './convocatoria-detalle';

describe('ConvocatoriaDetalle', () => {
  let component: ConvocatoriaDetalle;
  let fixture: ComponentFixture<ConvocatoriaDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvocatoriaDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(ConvocatoriaDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
