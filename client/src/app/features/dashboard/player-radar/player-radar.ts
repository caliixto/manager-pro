import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RadarStat {
  label: string;
  value: number; // 0 a 100
}

@Component({
  selector: 'app-player-radar',
  imports: [CommonModule],
  templateUrl: './player-radar.html',
  styleUrl: './player-radar.css',
})
export class PlayerRadar implements OnChanges {
 @Input() stats: RadarStat[] = [
  { label: 'Velocidad', value: 90 },
  { label: 'Pase', value: 40 },
  { label: 'Tiro', value: 65 },
  { label: 'Resistencia', value: 55 },
];

  size = 160;
  center = this.size / 2;
  maxRadius = this.size / 2 - 25;

  polygonPoints = '';
  axisLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  labelPositions: { x: number; y: number; text: string }[] = [];

  ngOnChanges() {
    this.calculatePoints();
  }

  ngOnInit() {
    this.calculatePoints();
  }

  private calculatePoints() {
    const total = this.stats.length;
    const angleStep = (Math.PI * 2) / total;

    // Puntos del polígono relleno (según el valor real de cada stat)
    const points: string[] = [];
    this.axisLines = [];
    this.labelPositions = [];

    this.stats.forEach((stat, i) => {
      const angle = angleStep * i - Math.PI / 2; // empieza arriba (-90°)
      const radius = (stat.value / 100) * this.maxRadius;

      const x = this.center + radius * Math.cos(angle);
      const y = this.center + radius * Math.sin(angle);
      points.push(`${x},${y}`);

      // Línea del eje (desde el centro hasta el borde máximo)
      const axisX = this.center + this.maxRadius * Math.cos(angle);
      const axisY = this.center + this.maxRadius * Math.sin(angle);
      this.axisLines.push({ x1: this.center, y1: this.center, x2: axisX, y2: axisY });

      // Posición de la etiqueta (un poco más allá del borde)
      const labelRadius = this.maxRadius + 18;
      const labelX = this.center + labelRadius * Math.cos(angle);
      const labelY = this.center + labelRadius * Math.sin(angle);
      this.labelPositions.push({ x: labelX, y: labelY, text: stat.label });
    });

    this.polygonPoints = points.join(' ');
  }
}