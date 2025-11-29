import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonRange,
  IonToggle,
  IonChip,
  IonNote
} from '@ionic/angular/standalone';
import { StationFilters, ConnectorType, ChargingSpeed, StationStatus, getConnectorLabel } from '../../models/station.model';
import { StationsService } from '../../services/stations.service';

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonRange,
    IonToggle,
    IonChip,
    IonNote
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="onClose()">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Filtros</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="clearAll()" fill="clear">
            Limpiar
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Connector Types -->
      <div class="filter-section">
        <h3 class="section-title">Tipo de conector</h3>
        <div class="chip-group">
          @for (type of connectorTypes; track type) {
            <ion-chip
              [color]="isConnectorSelected(type) ? 'primary' : 'medium'"
              (click)="toggleConnector(type)">
              <ion-label>{{ getConnectorLabel(type) }}</ion-label>
            </ion-chip>
          }
        </div>
      </div>

      <!-- Operators -->
      <div class="filter-section">
        <h3 class="section-title">Operador</h3>
        <div class="chip-group">
          @for (op of operators; track op) {
            <ion-chip
              [color]="isOperatorSelected(op) ? 'primary' : 'medium'"
              (click)="toggleOperator(op)">
              <ion-label>{{ op }}</ion-label>
            </ion-chip>
          }
        </div>
      </div>

      <!-- Charging Speed -->
      <div class="filter-section">
        <h3 class="section-title">Velocidad de carga</h3>
        <div class="chip-group">
          <ion-chip
            [color]="isSpeedSelected('slow') ? 'primary' : 'medium'"
            (click)="toggleSpeed('slow')">
            <ion-label>Lenta (≤7 kW)</ion-label>
          </ion-chip>
          <ion-chip
            [color]="isSpeedSelected('fast') ? 'primary' : 'medium'"
            (click)="toggleSpeed('fast')">
            <ion-label>Semi-rápida (7-22 kW)</ion-label>
          </ion-chip>
          <ion-chip
            [color]="isSpeedSelected('rapid') ? 'primary' : 'medium'"
            (click)="toggleSpeed('rapid')">
            <ion-label>Rápida (22-50 kW)</ion-label>
          </ion-chip>
          <ion-chip
            [color]="isSpeedSelected('ultra') ? 'primary' : 'medium'"
            (click)="toggleSpeed('ultra')">
            <ion-label>Ultra-rápida (>50 kW)</ion-label>
          </ion-chip>
        </div>
      </div>

      <!-- Power Range -->
      <div class="filter-section">
        <h3 class="section-title">
          Potencia mínima: {{ filters.minPowerKw || 0 }} kW
        </h3>
        <ion-range
          [min]="0"
          [max]="150"
          [step]="10"
          [value]="filters.minPowerKw || 0"
          (ionChange)="onPowerChange($event)"
          [pin]="true"
          [pinFormatter]="powerFormatter">
          <ion-label slot="start">0</ion-label>
          <ion-label slot="end">150 kW</ion-label>
        </ion-range>
      </div>

      <!-- Status -->
      <div class="filter-section">
        <h3 class="section-title">Estado</h3>
        <ion-list lines="none">
          <ion-item>
            <ion-checkbox
              slot="start"
              [checked]="isStatusSelected('available')"
              (ionChange)="toggleStatus('available')">
            </ion-checkbox>
            <ion-label>
              <span class="status-dot status-available"></span>
              Disponible
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-checkbox
              slot="start"
              [checked]="isStatusSelected('busy')"
              (ionChange)="toggleStatus('busy')">
            </ion-checkbox>
            <ion-label>
              <span class="status-dot status-busy"></span>
              Ocupada
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-checkbox
              slot="start"
              [checked]="isStatusSelected('unknown')"
              (ionChange)="toggleStatus('unknown')">
            </ion-checkbox>
            <ion-label>
              <span class="status-dot status-unknown"></span>
              Estado desconocido
            </ion-label>
          </ion-item>
        </ion-list>
      </div>

      <!-- Toggles -->
      <div class="filter-section">
        <h3 class="section-title">Otras opciones</h3>
        <ion-list lines="none">
          <ion-item>
            <ion-toggle
              [checked]="filters.isFree || false"
              (ionChange)="onFreeChange($event)">
            </ion-toggle>
            <ion-label>Solo estaciones gratuitas</ion-label>
          </ion-item>
          <ion-item>
            <ion-toggle
              [checked]="filters.is24Hours || false"
              (ionChange)="on24HoursChange($event)">
            </ion-toggle>
            <ion-label>Abiertas 24 horas</ion-label>
          </ion-item>
        </ion-list>
      </div>

      <!-- Apply button -->
      <div class="apply-section">
        <ion-button expand="block" (click)="applyFilters()">
          <ion-icon name="checkmark-outline" slot="start"></ion-icon>
          Aplicar filtros
        </ion-button>
        <ion-note class="results-note">
          {{ filteredCount }} estaciones encontradas
        </ion-note>
      </div>
    </ion-content>
  `,
  styles: [`
    .filter-section {
      padding: 16px;
      border-bottom: 1px solid var(--ion-color-light-shade);
    }

    .section-title {
      margin: 0 0 12px;
      font-size: 14px;
      font-weight: 600;
      color: var(--ion-color-dark);
    }

    .chip-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    ion-chip {
      --background: var(--ion-color-light);
      margin: 0;
    }

    ion-range {
      --bar-height: 4px;
      --bar-border-radius: 2px;
      --knob-size: 24px;
      padding: 0 8px;
    }

    ion-list {
      padding: 0;
      background: transparent;
    }

    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
      --background: transparent;
    }

    .status-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 8px;
    }

    .status-available { background: var(--ion-color-success); }
    .status-busy { background: var(--ion-color-warning); }
    .status-unavailable { background: var(--ion-color-danger); }
    .status-unknown { background: var(--ion-color-medium); }

    .apply-section {
      padding: 16px;
      text-align: center;
    }

    .results-note {
      display: block;
      margin-top: 8px;
      font-size: 13px;
    }
  `]
})
export class FilterModalComponent implements OnInit {
  @Input() currentFilters: StationFilters = {};
  @Output() filtersChange = new EventEmitter<StationFilters>();
  @Output() close = new EventEmitter<void>();

  filters: StationFilters = {};

  // Available options from stations service
  connectorTypes: ConnectorType[] = [];
  operators: string[] = [];

  filteredCount = 0;

  constructor(private stationsService: StationsService) {}

  ngOnInit(): void {
    // Clone current filters
    this.filters = { ...this.currentFilters };

    // Initialize arrays if not present
    if (!this.filters.connectorTypes) this.filters.connectorTypes = [];
    if (!this.filters.operators) this.filters.operators = [];
    if (!this.filters.status) this.filters.status = [];
    if (!this.filters.chargingSpeed) this.filters.chargingSpeed = [];

    // Get available options
    this.connectorTypes = this.stationsService.getAvailableConnectorTypes();
    this.operators = this.stationsService.getAvailableOperators();

    this.updateCount();
  }

  getConnectorLabel(type: ConnectorType): string {
    return getConnectorLabel(type);
  }

  powerFormatter(value: number): string {
    return `${value} kW`;
  }

  // Connector toggles
  isConnectorSelected(type: ConnectorType): boolean {
    return this.filters.connectorTypes?.includes(type) || false;
  }

  toggleConnector(type: ConnectorType): void {
    if (!this.filters.connectorTypes) this.filters.connectorTypes = [];

    const index = this.filters.connectorTypes.indexOf(type);
    if (index > -1) {
      this.filters.connectorTypes.splice(index, 1);
    } else {
      this.filters.connectorTypes.push(type);
    }
    this.updateCount();
  }

  // Operator toggles
  isOperatorSelected(operator: string): boolean {
    return this.filters.operators?.includes(operator) || false;
  }

  toggleOperator(operator: string): void {
    if (!this.filters.operators) this.filters.operators = [];

    const index = this.filters.operators.indexOf(operator);
    if (index > -1) {
      this.filters.operators.splice(index, 1);
    } else {
      this.filters.operators.push(operator);
    }
    this.updateCount();
  }

  // Speed toggles
  isSpeedSelected(speed: ChargingSpeed): boolean {
    return this.filters.chargingSpeed?.includes(speed) || false;
  }

  toggleSpeed(speed: ChargingSpeed): void {
    if (!this.filters.chargingSpeed) this.filters.chargingSpeed = [];

    const index = this.filters.chargingSpeed.indexOf(speed);
    if (index > -1) {
      this.filters.chargingSpeed.splice(index, 1);
    } else {
      this.filters.chargingSpeed.push(speed);
    }
    this.updateCount();
  }

  // Status toggles
  isStatusSelected(status: StationStatus): boolean {
    return this.filters.status?.includes(status) || false;
  }

  toggleStatus(status: StationStatus): void {
    if (!this.filters.status) this.filters.status = [];

    const index = this.filters.status.indexOf(status);
    if (index > -1) {
      this.filters.status.splice(index, 1);
    } else {
      this.filters.status.push(status);
    }
    this.updateCount();
  }

  // Power change
  onPowerChange(event: CustomEvent): void {
    this.filters.minPowerKw = event.detail.value;
    this.updateCount();
  }

  // Toggle changes
  onFreeChange(event: CustomEvent): void {
    this.filters.isFree = event.detail.checked ? true : undefined;
    this.updateCount();
  }

  on24HoursChange(event: CustomEvent): void {
    this.filters.is24Hours = event.detail.checked ? true : undefined;
    this.updateCount();
  }

  // Actions
  clearAll(): void {
    this.filters = {
      connectorTypes: [],
      operators: [],
      status: [],
      chargingSpeed: []
    };
    this.updateCount();
  }

  applyFilters(): void {
    // Clean up empty arrays
    const cleanFilters: StationFilters = {};

    if (this.filters.connectorTypes?.length) {
      cleanFilters.connectorTypes = this.filters.connectorTypes;
    }
    if (this.filters.operators?.length) {
      cleanFilters.operators = this.filters.operators;
    }
    if (this.filters.status?.length) {
      cleanFilters.status = this.filters.status;
    }
    if (this.filters.chargingSpeed?.length) {
      cleanFilters.chargingSpeed = this.filters.chargingSpeed;
    }
    if (this.filters.minPowerKw) {
      cleanFilters.minPowerKw = this.filters.minPowerKw;
    }
    if (this.filters.isFree) {
      cleanFilters.isFree = this.filters.isFree;
    }
    if (this.filters.is24Hours) {
      cleanFilters.is24Hours = this.filters.is24Hours;
    }

    this.filtersChange.emit(cleanFilters);
  }

  onClose(): void {
    this.close.emit();
  }

  private updateCount(): void {
    // Temporarily apply filters to get count
    const allStations = this.stationsService.stations();

    // Apply filter logic manually
    this.filteredCount = allStations.filter(station => {
      // Connector type filter
      if (this.filters.connectorTypes?.length) {
        const stationTypes = station.connectors.map(c => c.type);
        if (!this.filters.connectorTypes.some(t => stationTypes.includes(t))) {
          return false;
        }
      }

      // Operator filter
      if (this.filters.operators?.length) {
        if (!station.operator?.name || !this.filters.operators.includes(station.operator.name)) {
          return false;
        }
      }

      // Power filter
      if (this.filters.minPowerKw && station.maxPowerKw < this.filters.minPowerKw) {
        return false;
      }

      // Status filter
      if (this.filters.status?.length) {
        if (!this.filters.status.includes(station.status)) {
          return false;
        }
      }

      // Charging speed filter
      if (this.filters.chargingSpeed?.length) {
        if (!this.filters.chargingSpeed.includes(station.chargingSpeed)) {
          return false;
        }
      }

      // Free charging filter
      if (this.filters.isFree && !station.pricing?.isFree) {
        return false;
      }

      // 24 hours filter
      if (this.filters.is24Hours && !station.operatingHours?.is24Hours) {
        return false;
      }

      return true;
    }).length;
  }
}
