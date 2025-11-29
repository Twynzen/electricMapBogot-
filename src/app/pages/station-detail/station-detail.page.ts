import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonChip,
  IonNote,
  IonSpinner,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { StationsService } from '../../services/stations.service';
import { LocationService } from '../../services/location.service';
import { Station, getConnectorLabel, getStatusLabel, getSpeedLabel, formatPrice } from '../../models/station.model';

@Component({
  selector: 'app-station-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonChip,
    IonNote,
    IonSpinner,
    IonFab,
    IonFabButton
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/map"></ion-back-button>
        </ion-buttons>
        <ion-title>Detalle de estación</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="share()">
            <ion-icon name="share-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      @if (loading()) {
        <div class="loading-container">
          <ion-spinner name="crescent"></ion-spinner>
          <span>Cargando información...</span>
        </div>
      } @else if (station()) {
        <!-- Status banner -->
        <div class="status-banner" [class]="'status-' + station()!.status">
          <ion-icon [name]="getStatusIcon(station()!.status)"></ion-icon>
          <span>{{ getStatusLabel(station()!.status) }}</span>
        </div>

        <!-- Main info card -->
        <ion-card class="main-card">
          <ion-card-header>
            <ion-card-title>{{ station()!.name }}</ion-card-title>
            <ion-card-subtitle>
              <ion-icon name="business-outline"></ion-icon>
              {{ station()!.operator?.name || 'Operador desconocido' }}
            </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <!-- Address -->
            <div class="info-row">
              <ion-icon name="location-outline" color="primary"></ion-icon>
              <div class="info-content">
                <span class="info-label">Dirección</span>
                <span class="info-value">{{ station()!.address }}</span>
                @if (station()!.locality) {
                  <span class="info-note">{{ station()!.locality }}, {{ station()!.city }}</span>
                }
              </div>
            </div>

            <!-- Distance -->
            @if (distance() !== null) {
              <div class="info-row">
                <ion-icon name="navigate-outline" color="primary"></ion-icon>
                <div class="info-content">
                  <span class="info-label">Distancia</span>
                  <span class="info-value">{{ formatDistance(distance()!) }}</span>
                </div>
              </div>
            }

            <!-- Power -->
            <div class="info-row">
              <ion-icon name="flash-outline" color="primary"></ion-icon>
              <div class="info-content">
                <span class="info-label">Potencia máxima</span>
                <span class="info-value">{{ station()!.maxPowerKw }} kW</span>
                <span class="info-note">{{ getSpeedLabel(station()!.chargingSpeed) }}</span>
              </div>
            </div>

            <!-- Price -->
            <div class="info-row">
              <ion-icon name="pricetag-outline" color="primary"></ion-icon>
              <div class="info-content">
                <span class="info-label">Precio</span>
                <span class="info-value" [class.free]="station()!.pricing?.isFree">
                  {{ formatPrice(station()!.pricing) }}
                </span>
                @if (station()!.pricing?.notes) {
                  <span class="info-note">{{ station()!.pricing!.notes }}</span>
                }
              </div>
            </div>

            <!-- Hours -->
            <div class="info-row">
              <ion-icon name="time-outline" color="primary"></ion-icon>
              <div class="info-content">
                <span class="info-label">Horario</span>
                <span class="info-value">
                  @if (station()!.operatingHours?.is24Hours) {
                    Abierto 24 horas
                  } @else if (station()!.operatingHours?.notes) {
                    {{ station()!.operatingHours!.notes }}
                  } @else {
                    Consultar horario
                  }
                </span>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Connectors card -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>
              <ion-icon name="flash"></ion-icon>
              Conectores disponibles
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <div class="connectors-grid">
              @for (connector of station()!.connectors; track $index) {
                <div class="connector-item">
                  <div class="connector-icon">
                    <ion-icon name="flash"></ion-icon>
                  </div>
                  <div class="connector-info">
                    <span class="connector-type">{{ getConnectorLabel(connector.type) }}</span>
                    <span class="connector-power">{{ connector.powerKw }} kW</span>
                    <span class="connector-quantity">{{ connector.quantity }} punto(s)</span>
                  </div>
                </div>
              }
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Amenities card -->
        @if (station()!.amenities && station()!.amenities!.length > 0) {
          <ion-card>
            <ion-card-header>
              <ion-card-title>
                <ion-icon name="star-outline"></ion-icon>
                Servicios
              </ion-card-title>
            </ion-card-header>

            <ion-card-content>
              <div class="amenities-grid">
                @for (amenity of station()!.amenities; track amenity) {
                  <ion-chip>
                    <ion-icon [name]="getAmenityIcon(amenity)"></ion-icon>
                    <ion-label>{{ getAmenityLabel(amenity) }}</ion-label>
                  </ion-chip>
                }
              </div>
            </ion-card-content>
          </ion-card>
        }

        <!-- Actions -->
        <div class="actions-section">
          <ion-button expand="block" (click)="openInMaps()">
            <ion-icon name="navigate-outline" slot="start"></ion-icon>
            Abrir en Google Maps
          </ion-button>

          @if (station()!.operator?.website) {
            <ion-button expand="block" fill="outline" (click)="openWebsite()">
              <ion-icon name="globe-outline" slot="start"></ion-icon>
              Sitio web del operador
            </ion-button>
          }
        </div>

        <!-- Metadata -->
        <div class="metadata">
          <ion-note>
            Última actualización: {{ station()!.lastUpdated | date:'medium':'':'es' }}
          </ion-note>
          <ion-note>
            Fuente: {{ getSourceLabel(station()!.source) }}
            @if (station()!.verified) {
              <ion-icon name="checkmark-circle" color="success"></ion-icon>
            }
          </ion-note>
        </div>
      } @else {
        <div class="error-container">
          <ion-icon name="warning-outline" color="warning"></ion-icon>
          <h3>Estación no encontrada</h3>
          <p>No pudimos encontrar información de esta estación.</p>
          <ion-button (click)="goBack()">Volver al mapa</ion-button>
        </div>
      }
    </ion-content>
  `,
  styles: [`
    .loading-container,
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50%;
      gap: 16px;
      text-align: center;
      padding: 24px;
    }

    .error-container ion-icon {
      font-size: 64px;
    }

    .status-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      font-weight: 600;
      color: #fff;

      ion-icon {
        font-size: 20px;
      }

      &.status-available {
        background: var(--ion-color-success);
      }

      &.status-busy {
        background: var(--ion-color-warning);
        color: #000;
      }

      &.status-unavailable {
        background: var(--ion-color-danger);
      }

      &.status-unknown {
        background: var(--ion-color-medium);
      }
    }

    .main-card {
      margin-top: 0;
      border-radius: 0 0 16px 16px;
    }

    ion-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
    }

    ion-card-subtitle {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 4px;
    }

    .info-row {
      display: flex;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--ion-color-light-shade);

      &:last-child {
        border-bottom: none;
      }

      ion-icon {
        font-size: 24px;
        flex-shrink: 0;
      }
    }

    .info-content {
      display: flex;
      flex-direction: column;
    }

    .info-label {
      font-size: 12px;
      color: var(--ion-color-medium);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 16px;
      font-weight: 500;
      margin: 2px 0;

      &.free {
        color: var(--ion-color-success);
      }
    }

    .info-note {
      font-size: 13px;
      color: var(--ion-color-medium);
    }

    .connectors-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .connector-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--ion-color-light);
      border-radius: 12px;
    }

    .connector-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--ion-color-primary);
      border-radius: 50%;
      color: #fff;

      ion-icon {
        font-size: 24px;
      }
    }

    .connector-info {
      display: flex;
      flex-direction: column;
    }

    .connector-type {
      font-weight: 600;
      font-size: 15px;
    }

    .connector-power {
      font-size: 14px;
      color: var(--ion-color-primary);
    }

    .connector-quantity {
      font-size: 13px;
      color: var(--ion-color-medium);
    }

    .amenities-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .actions-section {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .metadata {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: center;

      ion-note {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        font-size: 12px;
      }
    }
  `]
})
export class StationDetailPage implements OnInit {
  station = signal<Station | null>(null);
  loading = signal(true);
  distance = signal<number | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stationsService: StationsService,
    private locationService: LocationService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading.set(false);
      return;
    }

    const stationData = await this.stationsService.getStationAsync(id);
    this.station.set(stationData);
    this.loading.set(false);

    // Calculate distance if user location available
    if (stationData) {
      const dist = this.locationService.getDistanceTo(stationData.latitude, stationData.longitude);
      this.distance.set(dist);
    }
  }

  // Helper methods
  getConnectorLabel = getConnectorLabel;
  getStatusLabel = getStatusLabel;
  getSpeedLabel = getSpeedLabel;
  formatPrice = formatPrice;

  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      'available': 'checkmark-circle',
      'busy': 'time',
      'unavailable': 'close-circle',
      'unknown': 'help-circle'
    };
    return icons[status] || 'help-circle';
  }

  getAmenityIcon(amenity: string): string {
    const icons: Record<string, string> = {
      'parking': 'car-outline',
      'restroom': 'person-outline',
      'wifi': 'wifi-outline',
      'cafe': 'cafe-outline',
      'shopping': 'bag-outline',
      'convenience_store': 'storefront-outline',
      'hotel': 'bed-outline'
    };
    return icons[amenity] || 'star-outline';
  }

  getAmenityLabel(amenity: string): string {
    const labels: Record<string, string> = {
      'parking': 'Estacionamiento',
      'restroom': 'Baños',
      'wifi': 'WiFi',
      'cafe': 'Cafetería',
      'shopping': 'Tiendas',
      'convenience_store': 'Tienda de conveniencia',
      'hotel': 'Hotel'
    };
    return labels[amenity] || amenity;
  }

  getSourceLabel(source: string): string {
    const labels: Record<string, string> = {
      'manual': 'Verificación manual',
      'ocm': 'OpenChargeMap',
      'scrape': 'Datos del operador',
      'operator': 'Información oficial',
      'community': 'Comunidad'
    };
    return labels[source] || source;
  }

  formatDistance(km: number): string {
    if (km < 1) {
      return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
  }

  openInMaps(): void {
    const s = this.station();
    if (!s) return;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`;
    window.open(url, '_blank');
  }

  openWebsite(): void {
    const s = this.station();
    if (s?.operator?.website) {
      window.open(s.operator.website, '_blank');
    }
  }

  share(): void {
    const s = this.station();
    if (!s) return;

    if (navigator.share) {
      navigator.share({
        title: s.name,
        text: `Estación de carga: ${s.name} - ${s.address}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  }

  goBack(): void {
    this.router.navigate(['/tabs/map']);
  }
}
