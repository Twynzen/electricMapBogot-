import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
  IonBadge,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonChip
} from '@ionic/angular/standalone';
import { StationsService } from '../../services/stations.service';
import { LocationService } from '../../services/location.service';
import { Station, getConnectorLabel, formatPrice } from '../../models/station.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonIcon,
    IonBadge,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonChip
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Estaciones</ion-title>
      </ion-toolbar>

      <ion-toolbar>
        <ion-searchbar
          placeholder="Buscar estación..."
          [debounce]="300"
          (ionInput)="onSearch($event)"
          [animated]="true">
        </ion-searchbar>
      </ion-toolbar>

      <ion-toolbar>
        <ion-segment [value]="sortBy()" (ionChange)="onSortChange($event)">
          <ion-segment-button value="name">
            <ion-label>Nombre</ion-label>
          </ion-segment-button>
          <ion-segment-button value="distance">
            <ion-label>Distancia</ion-label>
          </ion-segment-button>
          <ion-segment-button value="power">
            <ion-label>Potencia</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      @if (stationsService.loading()) {
        <div class="loading-container">
          <ion-spinner name="crescent"></ion-spinner>
          <span>Cargando estaciones...</span>
        </div>
      } @else if (displayedStations().length === 0) {
        <div class="empty-container">
          <ion-icon name="flash-outline" color="medium"></ion-icon>
          <h3>No hay estaciones</h3>
          <p>No se encontraron estaciones con los filtros actuales.</p>
        </div>
      } @else {
        <ion-list>
          @for (station of displayedStations(); track station.id) {
            <ion-item
              [button]="true"
              [detail]="true"
              (click)="openStation(station)">
              <div class="station-status-indicator" [class]="'status-' + station.status" slot="start"></div>

              <ion-label>
                <h2>{{ station.name }}</h2>
                <p class="operator">{{ station.operator?.name || 'Operador desconocido' }}</p>
                <p class="address">
                  <ion-icon name="location-outline"></ion-icon>
                  {{ station.address }}
                </p>
                <div class="station-badges">
                  <ion-chip color="primary" class="power-chip">
                    <ion-icon name="flash-outline"></ion-icon>
                    <ion-label>{{ station.maxPowerKw }} kW</ion-label>
                  </ion-chip>
                  @for (type of getUniqueConnectors(station); track type) {
                    <ion-chip class="connector-chip">
                      <ion-label>{{ type }}</ion-label>
                    </ion-chip>
                  }
                </div>
              </ion-label>

              <div slot="end" class="end-content">
                @if (station.pricing?.isFree) {
                  <ion-badge color="success">Gratis</ion-badge>
                } @else if (station.pricing?.pricePerKwh) {
                  <ion-note class="price">\${{ station.pricing.pricePerKwh }}/kWh</ion-note>
                }
                @if (getDistance(station) !== null) {
                  <ion-note class="distance">{{ formatDistance(getDistance(station)!) }}</ion-note>
                }
              </div>
            </ion-item>
          }
        </ion-list>

        <div class="list-footer">
          <ion-note>{{ displayedStations().length }} estaciones</ion-note>
        </div>
      }
    </ion-content>
  `,
  styles: [`
    .loading-container,
    .empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50%;
      gap: 16px;
      text-align: center;
      padding: 24px;

      ion-icon {
        font-size: 64px;
      }
    }

    ion-item {
      --padding-start: 12px;
      --inner-padding-end: 12px;
    }

    .station-status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 8px;

      &.status-available {
        background: var(--ion-color-success);
      }

      &.status-busy {
        background: var(--ion-color-warning);
      }

      &.status-unavailable {
        background: var(--ion-color-danger);
      }

      &.status-unknown {
        background: var(--ion-color-medium);
      }
    }

    h2 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .operator {
      color: var(--ion-color-medium);
      font-size: 13px;
      margin: 2px 0;
    }

    .address {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--ion-color-medium);
      font-size: 12px;
      margin: 4px 0;

      ion-icon {
        font-size: 14px;
      }
    }

    .station-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 8px;
    }

    ion-chip {
      height: 24px;
      font-size: 11px;
      margin: 0;
    }

    .power-chip {
      --background: rgba(26, 115, 232, 0.1);
      --color: var(--ion-color-primary);
    }

    .connector-chip {
      --background: var(--ion-color-light);
      --color: var(--ion-color-dark);
    }

    .end-content {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .price {
      font-size: 13px;
      font-weight: 500;
    }

    .distance {
      font-size: 12px;
      color: var(--ion-color-primary);
    }

    .list-footer {
      padding: 16px;
      text-align: center;
    }
  `]
})
export class ListPage implements OnInit {
  searchQuery = signal('');
  sortBy = signal<'name' | 'distance' | 'power'>('name');

  displayedStations = computed(() => {
    let stations = this.stationsService.filteredStations();

    // Apply search filter
    const query = this.searchQuery().toLowerCase();
    if (query.length >= 2) {
      stations = stations.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query) ||
        s.operator?.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sort = this.sortBy();
    return [...stations].sort((a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'distance':
          const distA = this.getDistance(a) ?? 999999;
          const distB = this.getDistance(b) ?? 999999;
          return distA - distB;
        case 'power':
          return b.maxPowerKw - a.maxPowerKw;
        default:
          return 0;
      }
    });
  });

  constructor(
    public stationsService: StationsService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Try to get location for distance calculation
    this.locationService.getCurrentPosition();
  }

  onSearch(event: CustomEvent): void {
    this.searchQuery.set(event.detail.value || '');
  }

  onSortChange(event: CustomEvent): void {
    this.sortBy.set(event.detail.value);
  }

  async doRefresh(event: CustomEvent): Promise<void> {
    await this.stationsService.loadStations(true);
    (event.target as any).complete();
  }

  openStation(station: Station): void {
    this.router.navigate(['/station', station.id]);
  }

  getUniqueConnectors(station: Station): string[] {
    return [...new Set(station.connectors.map(c => c.type))];
  }

  getDistance(station: Station): number | null {
    return this.locationService.getDistanceTo(station.latitude, station.longitude);
  }

  formatDistance(km: number): string {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
  }

  formatPrice = formatPrice;
}
