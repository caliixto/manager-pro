import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ejesRadarPorPosicion,etiquetasStats  } from '../../../shared/radar-config';

interface RadarStat {
  label: string;
  value: number;
}

@Component({
  selector: 'app-player-radar',
  imports: [CommonModule],
  templateUrl: './player-radar.html',
  styleUrl: './player-radar.css',
})
export class PlayerRadar implements OnChanges {
  @Input() jugadorStats: Record<string, number> = {}; // las 12 stats completas del jugador
  @Input() posicion: string = 'CEN'; // POR, DEF, CEN, DEL

  stats: RadarStat[] = [];

  size = 160;
  center = this.size / 2;
  maxRadius = this.size / 2 - 25;

  polygonPoints = '';
  axisLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  labelPositions: { x: number; y: number; text: string }[] = [];

  ngOnChanges() {
    this.seleccionarStatsRelevantes();
    this.calculatePoints();
  }

  ngOnInit() {
    this.seleccionarStatsRelevantes();
    this.calculatePoints();
  }

  private seleccionarStatsRelevantes() {
    const ejes = ejesRadarPorPosicion[this.posicion] || ejesRadarPorPosicion['CEN'];
    
    this.stats = ejes.map(clave => ({
      label: etiquetasStats[clave] || clave,
      value: this.jugadorStats[clave] ?? 50
    }));
  }

  private calculatePoints() {
    const total = this.stats.length;
    const angleStep = (Math.PI * 2) / total;

    const points: string[] = [];
    this.axisLines = [];
    this.labelPositions = [];

    this.stats.forEach((stat, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const radius = (stat.value / 100) * this.maxRadius;

      const x = this.center + radius * Math.cos(angle);
      const y = this.center + radius * Math.sin(angle);
      points.push(`${x},${y}`);

      const axisX = this.center + this.maxRadius * Math.cos(angle);
      const axisY = this.center + this.maxRadius * Math.sin(angle);
      this.axisLines.push({ x1: this.center, y1: this.center, x2: axisX, y2: axisY });

      const labelRadius = this.maxRadius + 18;
      const labelX = this.center + labelRadius * Math.cos(angle);
      const labelY = this.center + labelRadius * Math.sin(angle);
      this.labelPositions.push({ x: labelX, y: labelY, text: stat.label });
    });

    this.polygonPoints = points.join(' ');
  }
}