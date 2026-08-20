import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorResistencia',
  standalone: true
})
export class ColorResistenciaPipe implements PipeTransform {
  transform(resistencia: number): string {
    if (resistencia >= 70) return 'resistencia-verde';
    if (resistencia >= 40) return 'resistencia-naranja';
    return 'resistencia-roja';
  }
}
