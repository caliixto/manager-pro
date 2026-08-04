import { Component, OnInit, signal, computed, afterNextRender  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartidoService, Partido } from '../partido';

interface DiaCalendario {
  numero: number | null; // null = celda vacía (relleno antes/después del mes)
  fecha: Date | null;
  partido: Partido | null;
}

@Component({
  selector: 'app-calendario',
  imports: [CommonModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css',
})
export class Calendario implements OnInit {
  partidos = signal<Partido[]>([]);
  loading = signal(true);
  errorMsg = signal('');
  mesActual = signal<number>(new Date().getMonth()); // 0-11
  anioActual = signal<number>(new Date().getFullYear());
  diaResaltadoAnimacion = signal<number | null>(null);
  animacionTerminada = signal(false);

  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

   proximoPartido = computed<Partido | null>(() => {
    const pendientes = this.partidos()
      .filter(p => !p.jugado)
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    return pendientes[0] ?? null;
  });

  constructor(private partidoService: PartidoService) {
    afterNextRender(() => {
      this.scrollAlProximoPartido();
    });
  }

  private scrollAlProximoPartido() {
    const el = document.getElementById('proximo-partido');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  ngOnInit() {
    this.cargarPartidos();
  }

  cargarPartidos() {
    this.loading.set(true);
    this.partidoService.listarPartidos().subscribe({
      next: (response) => {
        this.partidos.set(response.partidos);
         this.irAMesRelevante();
        this.loading.set(false);
        this.iniciarAnimacionRecorrido();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg.set('No se pudo cargar el calendario');
        this.loading.set(false);
      }
    });
  }

   private irAMesRelevante() {
    const partido = this.proximoPartido();
    let fechaReferencia: Date;

    if (partido) {
      // Hay partido pendiente: vamos a su mes
      fechaReferencia = new Date(partido.fecha);
    } else {
      // Temporada completa: nos quedamos en el mes del último partido jugado
      const jugados = this.partidos()
        .filter(p => p.jugado)
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      fechaReferencia = jugados[0] ? new Date(jugados[0].fecha) : new Date();
    }

    this.mesActual.set(fechaReferencia.getMonth());
    this.anioActual.set(fechaReferencia.getFullYear());
  }

  // Genera la cuadrícula completa del mes, incluyendo celdas vacías de relleno
  get semanasDelMes(): DiaCalendario[][] {
    const anio = this.anioActual();
    const mes = this.mesActual();

    const primerDiaMes = new Date(anio, mes, 1);
    const ultimoDiaMes = new Date(anio, mes + 1, 0);
    const totalDias = ultimoDiaMes.getDate();

    // getDay() devuelve 0=domingo, 6=sábado. Ajustamos para que la semana empiece en lunes
    let primerDiaSemana = primerDiaMes.getDay();
    primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

    const dias: DiaCalendario[] = [];

    // Relleno antes del día 1
    for (let i = 0; i < primerDiaSemana; i++) {
      dias.push({ numero: null, fecha: null, partido: null });
    }

    // Los días reales del mes
    for (let dia = 1; dia <= totalDias; dia++) {
      const fecha = new Date(anio, mes, dia);
      const partidoDelDia = this.buscarPartidoEnFecha(fecha);
      dias.push({ numero: dia, fecha, partido: partidoDelDia });
    }

    // Relleno al final, hasta completar semanas de 7
    while (dias.length % 7 !== 0) {
      dias.push({ numero: null, fecha: null, partido: null });
    }

    // Agrupamos en semanas de 7
    const semanas: DiaCalendario[][] = [];
    for (let i = 0; i < dias.length; i += 7) {
      semanas.push(dias.slice(i, i + 7));
    }

    return semanas;
  }

  private buscarPartidoEnFecha(fecha: Date): Partido | null {
    return this.partidos().find(p => {
      const fechaPartido = new Date(p.fecha);
      return (
        fechaPartido.getFullYear() === fecha.getFullYear() &&
        fechaPartido.getMonth() === fecha.getMonth() &&
        fechaPartido.getDate() === fecha.getDate()
      );
    }) || null;
  }

  nombreMesActual(): string {
    const nombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${nombres[this.mesActual()]} ${this.anioActual()}`;
  }

  mesAnterior() {
    if (this.mesActual() === 0) {
      this.mesActual.set(11);
      this.anioActual.set(this.anioActual() - 1);
    } else {
      this.mesActual.set(this.mesActual() - 1);
    }
  }

  mesSiguiente() {
    if (this.mesActual() === 11) {
      this.mesActual.set(0);
      this.anioActual.set(this.anioActual() + 1);
    } else {
      this.mesActual.set(this.mesActual() + 1);
    }
  }

  getResultadoTexto(p: Partido): string {
    if (!p.jugado) return '';
    return `${p.resultado.golesPropios}-${p.resultado.golesRival}`;
  }

  getResultadoClase(p: Partido): string {
    if (!p.jugado) return '';
    const { golesPropios, golesRival } = p.resultado;
    if (golesPropios! > golesRival!) return 'win';
    if (golesPropios === golesRival) return 'draw';
    return 'loss';
  }

  private iniciarAnimacionRecorrido() {
  const partido = this.proximoPartido();
  if (!partido) return; // temporada completa, no hay a dónde "viajar"

  const fechaPartido = new Date(partido.fecha);

  if (fechaPartido.getMonth() !== this.mesActual() || fechaPartido.getFullYear() !== this.anioActual()) {
    this.animacionTerminada.set(true);
    return;
  }

  const diaObjetivo = fechaPartido.getDate();

  // 👇 NUEVO: buscamos el último partido YA JUGADO dentro de este mismo mes
  const jugadosEnEsteMes = this.partidos()
    .filter(p => {
      if (!p.jugado) return false;
      const f = new Date(p.fecha);
      return f.getMonth() === this.mesActual() && f.getFullYear() === this.anioActual();
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()); // más reciente primero

  // Si hay un partido jugado este mes, arrancamos desde su día. Si no, desde el día 1.
  let diaActual = jugadosEnEsteMes[0]
    ? new Date(jugadosEnEsteMes[0].fecha).getDate()
    : 1;

  // Si por lo que sea ya estamos en el día objetivo o más allá, no animamos nada
  if (diaActual >= diaObjetivo) {
    this.animacionTerminada.set(true);
    return;
  }

  this.diaResaltadoAnimacion.set(diaActual);

  const intervalo = setInterval(() => {
    diaActual++;
    this.diaResaltadoAnimacion.set(diaActual);

    if (diaActual >= diaObjetivo) {
      clearInterval(intervalo);
      this.animacionTerminada.set(true);
      this.diaResaltadoAnimacion.set(null);
    }
  }, 300); // Velocidad
}

  esCeldaEscaneando(dia: DiaCalendario): boolean {
    return dia.numero !== null && dia.numero === this.diaResaltadoAnimacion();
  }

  esProximoPartido(dia: DiaCalendario): boolean {
    const proximo = this.proximoPartido();
    if (!proximo || !dia.partido) return false;
    return dia.partido._id === proximo._id && this.animacionTerminada();
  }
}