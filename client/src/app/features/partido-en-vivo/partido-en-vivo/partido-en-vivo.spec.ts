import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidoEnVivo } from './partido-en-vivo';

describe('PartidoEnVivo', () => {
  let component: PartidoEnVivo;
  let fixture: ComponentFixture<PartidoEnVivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartidoEnVivo],
    }).compileComponents();

    fixture = TestBed.createComponent(PartidoEnVivo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
