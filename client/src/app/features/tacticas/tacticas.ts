import { Component, OnInit, signal } from '@angular/core';
import { JugadorService, Jugador } from '../plantilla/jugador';
import { TacticaService } from '../../shared/tactica';
import { FORMACIONES, SlotFormacion } from '../../shared/formaciones';
import { CommonModule } from '@angular/common';
import { computed } from '@angular/core';

@Component({
  selector: 'app-tacticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tacticas.html',
  styleUrl: './tacticas.css',
})
export class Tacticas implements OnInit {
  plantillaCompleta = signal<Jugador[]>([]);
  titulares = signal<Jugador[]>([]);
  loading = signal(true);
  errorMsg = signal('');
  formacionSeleccionada = signal<string>('4-3-3');
  formacionesDisponibles = Object.keys(FORMACIONES);
  
  suplentes = computed(() => {
  const idstitulares = new Set(this.titulares().map(j => j._id));
  return this.plantillaCompleta().filter(j => !idstitulares.has(j._id));
});

  cambiarFormacion(nuevaFormacion: string): void {
    this.formacionSeleccionada.set(nuevaFormacion);
    this.recolocarTitulares();
  }
  

  constructor(
    private jugadorService: JugadorService,
    private tacticaService: TacticaService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.jugadorService.listarConEstadisticas().subscribe({
      next: (res) => {
        this.plantillaCompleta.set(res.jugadores);
        this.cargarAlineacion();
      },
      error: (err) => {
        console.log(err);
        this.errorMsg.set('Error al cargar la plantilla');
        this.loading.set(false);
      }
    });
  }

  cargarAlineacion(): void {
    this.tacticaService.obtenerAlineacion().subscribe({
      next: (res) => {
        this.titulares.set(res.alineacion);
        this.recolocarTitulares();
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.errorMsg.set('Error al cargar la alineación');
        this.loading.set(false);
      }
  });
}

  recolocarTitulares(): void {
    const slots = FORMACIONES[this.formacionSeleccionada()];
    const disponibles = [...this.titulares(), ...this.plantillaCompleta()];
    // quitamos duplicados por si un jugador ya estaba en titulares
    const disponiblesUnicos = disponibles.filter((j, i, arr) =>
      arr.findIndex(x => x._id === j._id) === i
    );

    const nuevaAlineacion: Jugador[] = [];
    const usados = new Set<string>();

    for (const slot of slots) {
      const candidato = disponiblesUnicos.find(j => j.posicion === slot.posicion && !usados.has(j._id!));
      if (candidato) {
        nuevaAlineacion.push(candidato);
        usados.add(candidato._id!);
      }
    }

    this.titulares.set(nuevaAlineacion);
  }

  // Combina cada titular con su slot correspondiente, en orden
  get titularesConSlot(): { jugador: Jugador; slot: SlotFormacion }[] {
    const slots = FORMACIONES[this.formacionSeleccionada()];
    return this.titulares().map((jugador, i) => ({ jugador, slot: slots[i] }));
  }

    jugadorSeleccionado = signal<Jugador | null>(null);

  seleccionarJugador(jugador: Jugador): void {
    const actual = this.jugadorSeleccionado();

    // Si no hay nadie seleccionado, seleccionamos este
    if (!actual) {
      this.jugadorSeleccionado.set(jugador);
      return;
    }

    // Si haces click en el mismo jugador otra vez, deseleccionas
    if (actual._id === jugador._id) {
      this.jugadorSeleccionado.set(null);
      return;
    }

    // Si el nuevo click es sobre un compatible (misma posición, lado contrario), hacemos el swap
    if (actual.posicion === jugador.posicion) {
      this.intercambiarJugadores(actual, jugador);
      this.jugadorSeleccionado.set(null);
      return;
    }

    // Si haces click en otro jugador no compatible, simplemente cambia la selección a ese
    this.jugadorSeleccionado.set(jugador);
  }

  intercambiarJugadores(jugadorA: Jugador, jugadorB: Jugador): void {
  const estaEnTitulares = (j: Jugador) => this.titulares().some(t => t._id === j._id);

  const aEnTitulares = estaEnTitulares(jugadorA);
  const bEnTitulares = estaEnTitulares(jugadorB);

  // CASO 1: Uno en campo y otro en banquillo (Sustitución clásica)
  if (aEnTitulares !== bEnTitulares) {
    const [titular, suplente] = aEnTitulares ? [jugadorA, jugadorB] : [jugadorB, jugadorA];
    const nuevosTitulares = this.titulares().map(j =>
      j._id === titular._id ? suplente : j
    );
    this.titulares.set(nuevosTitulares);
    return;
  }

  // CASO 2: Ambos están en el CAMPO (Intercambio de posiciones entre titulares)
  if (aEnTitulares && bEnTitulares) {
    const nuevosTitulares = this.titulares().map(j => {
      if (j._id === jugadorA._id) return jugadorB;
      if (j._id === jugadorB._id) return jugadorA;
      return j;
    });
    this.titulares.set(nuevosTitulares);
    return;
  }
}

  // Para saber si un jugador concreto debe resaltarse como "compatible" con el seleccionado
  esCompatible(jugador: Jugador): boolean {
    const sel = this.jugadorSeleccionado();
    if (!sel || sel._id === jugador._id) return false;
    return sel.posicion === jugador.posicion;
  }

  esSeleccionado(jugador: Jugador): boolean {
    return this.jugadorSeleccionado()?._id === jugador._id;
  }

}