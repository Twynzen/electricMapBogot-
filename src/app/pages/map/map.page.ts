import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonSearchbar,
  IonChip,
  IonLabel,
  IonSpinner,
  IonModal,
  IonButtons,
  IonBadge
} from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { StationsService } from '../../services/stations.service';
import { LocationService } from '../../services/location.service';
import { StationMapMarker, StationFilters, ConnectorType } from '../../models/station.model';
import { environment } from '@env/environment';
import { FilterModalComponent } from '../../components/filter-modal/filter-modal.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonSearchbar,
    IonChip,
    IonLabel,
    IonSpinner,
    IonModal,
    IonButtons,
    IonBadge,
    FilterModalComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>
          <div class="header-title">
            <ion-icon name="flash"></ion-icon>
            <span>ElectricMap Bogotá</span>
          </div>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="openFilters()">
            <ion-icon name="filter-outline" slot="icon-only"></ion-icon>
            @if (activeFilterCount() > 0) {
              <ion-badge color="danger">{{ activeFilterCount() }}</ion-badge>
            }
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

      <!-- Search bar -->
      <ion-toolbar>
        <ion-searchbar
          placeholder="Buscar estación o dirección..."
          [debounce]="300"
          (ionInput)="onSearch($event)"
          [animated]="true">
        </ion-searchbar>
      </ion-toolbar>

      <!-- Quick filters -->
      <ion-toolbar class="quick-filters">
        <div class="filter-chips">
          <ion-chip
            [color]="isFilterActive('rapid') ? 'primary' : 'medium'"
            (click)="toggleQuickFilter('rapid')">
            <ion-icon name="flash-outline"></ion-icon>
            <ion-label>Carga rápida</ion-label>
          </ion-chip>
          <ion-chip
            [color]="isFilterActive('available') ? 'success' : 'medium'"
            (click)="toggleQuickFilter('available')">
            <ion-icon name="checkmark-circle-outline"></ion-icon>
            <ion-label>Disponibles</ion-label>
          </ion-chip>
          <ion-chip
            [color]="isFilterActive('free') ? 'tertiary' : 'medium'"
            (click)="toggleQuickFilter('free')">
            <ion-icon name="pricetag-outline"></ion-icon>
            <ion-label>Gratis</ion-label>
          </ion-chip>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <!-- Map container -->
      <div #mapContainer class="map-container" id="map"></div>

      <!-- Loading overlay -->
      @if (loading()) {
        <div class="loading-overlay">
          <ion-spinner name="crescent"></ion-spinner>
          <span>Cargando estaciones...</span>
        </div>
      }

      <!-- Stats bar -->
      <div class="stats-bar">
        <span class="stats-text">
          <ion-icon name="flash-outline"></ion-icon>
          {{ stationsService.stats().total }} estaciones
          <span class="separator">|</span>
          <span class="available">{{ stationsService.stats().available }} disponibles</span>
        </span>
      </div>

      <!-- Locate me FAB -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button
          [color]="locationService.location() ? 'primary' : 'medium'"
          (click)="locateMe()"
          [disabled]="locationLoading()">
          @if (locationLoading()) {
            <ion-spinner name="crescent"></ion-spinner>
          } @else {
            <ion-icon name="locate-outline"></ion-icon>
          }
        </ion-fab-button>
      </ion-fab>

      <!-- Filter modal -->
      <ion-modal
        #filterModal
        [isOpen]="showFilters()"
        (didDismiss)="closeFilters()">
        <ng-template>
          <app-filter-modal
            [currentFilters]="stationsService.filters()"
            (filtersChange)="applyFilters($event)"
            (close)="closeFilters()">
          </app-filter-modal>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  styles: [`
    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
    }

    .quick-filters {
      --padding-start: 8px;
      --padding-end: 8px;
    }

    .filter-chips {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 4px 0;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    ion-chip {
      --background: var(--ion-color-light);
      flex-shrink: 0;
    }

    .map-container {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .loading-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.95);
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    .stats-bar {
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.95);
      padding: 8px 16px;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 1000;
    }

    .stats-text {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--ion-color-dark);

      ion-icon {
        color: var(--ion-color-primary);
      }

      .separator {
        color: var(--ion-color-medium);
        margin: 0 4px;
      }

      .available {
        color: var(--ion-color-success);
      }
    }

    ion-fab-button {
      --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    ion-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      font-size: 10px;
      min-width: 18px;
      height: 18px;
    }
  `]
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map: L.Map | null = null;
  private markersLayer: L.LayerGroup | null = null;
  private userMarker: L.Marker | null = null;

  // Signals for reactive state
  loading = signal(false);
  locationLoading = signal(false);
  showFilters = signal(false);
  searchQuery = signal('');
  quickFilters = signal<Set<string>>(new Set());

  activeFilterCount = signal(0);

  constructor(
    public stationsService: StationsService,
    public locationService: LocationService,
    private router: Router
  ) {
    // React to station changes
    effect(() => {
      const markers = this.stationsService.mapMarkers();
      if (this.map && markers.length > 0) {
        this.updateMarkers(markers);
      }
    });

    // React to filter changes
    effect(() => {
      const filters = this.stationsService.filters();
      this.activeFilterCount.set(this.countActiveFilters(filters));
    });
  }

  ngOnInit(): void {
    this.loading.set(this.stationsService.loading());
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private initMap(): void {
    const config = environment.map;

    // Create map
    this.map = L.map('map', {
      center: [config.defaultCenter.lat, config.defaultCenter.lng],
      zoom: config.defaultZoom,
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      zoomControl: false // We'll add custom controls
    });

    // Add tile layer (OpenStreetMap - free)
    L.tileLayer(config.tileLayer, {
      attribution: config.tileAttribution,
      maxZoom: config.maxZoom
    }).addTo(this.map);

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Create markers layer
    this.markersLayer = L.layerGroup().addTo(this.map);

    // Initial markers
    const markers = this.stationsService.mapMarkers();
    if (markers.length > 0) {
      this.updateMarkers(markers);
    }

    // Try to get user location
    this.tryAutoLocate();
  }

  private updateMarkers(stations: StationMapMarker[]): void {
    if (!this.markersLayer) return;

    // Clear existing markers
    this.markersLayer.clearLayers();

    // Add station markers
    stations.forEach(station => {
      const marker = this.createStationMarker(station);
      this.markersLayer!.addLayer(marker);
    });
  }

  private createStationMarker(station: StationMapMarker): L.Marker {
    // Custom icon based on status
    const iconColor = this.getStatusColor(station.status);
    const iconHtml = `
      <div class="station-marker station-marker--${station.status}" style="background: ${iconColor};">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.51c.4 0 .62.19.4.66C12.11 17.55 11 21 11 21z"/>
        </svg>
      </div>
    `;

    const icon = L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    });

    const marker = L.marker([station.latitude, station.longitude], { icon });

    // Popup content
    const popupContent = this.createPopupContent(station);
    marker.bindPopup(popupContent, {
      maxWidth: 280,
      className: 'station-popup'
    });

    // Click handler to navigate to detail
    marker.on('click', () => {
      marker.openPopup();
    });

    return marker;
  }

  private createPopupContent(station: StationMapMarker): string {
    const statusLabel = this.getStatusLabel(station.status);
    const statusColor = this.getStatusColor(station.status);
    const connectors = station.connectorTypes.join(', ');

    return `
      <div class="popup-content">
        <h3 class="popup-title">${station.name}</h3>
        <div class="popup-operator">${station.operatorName || 'Operador desconocido'}</div>
        <div class="popup-status" style="color: ${statusColor}">
          <span class="status-dot" style="background: ${statusColor}"></span>
          ${statusLabel}
        </div>
        <div class="popup-info">
          <span><strong>${station.maxPowerKw} kW</strong> máx</span>
          <span>${connectors}</span>
        </div>
        <button class="popup-button" onclick="window.dispatchEvent(new CustomEvent('openStation', {detail: '${station.id}'}))">
          Ver detalles
        </button>
      </div>
      <style>
        .popup-content { padding: 4px; }
        .popup-title { margin: 0 0 4px; font-size: 16px; font-weight: 600; }
        .popup-operator { color: #666; font-size: 13px; margin-bottom: 8px; }
        .popup-status { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; margin-bottom: 8px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .popup-info { display: flex; gap: 12px; font-size: 12px; color: #666; margin-bottom: 12px; }
        .popup-button { width: 100%; padding: 10px; background: #1a73e8; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; }
        .popup-button:hover { background: #1557b0; }
      </style>
    `;
  }

  private getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'available': '#2dd36f',
      'busy': '#ffc409',
      'unavailable': '#eb445a',
      'unknown': '#92949c'
    };
    return colors[status] || colors['unknown'];
  }

  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'available': 'Disponible',
      'busy': 'Ocupada',
      'unavailable': 'No disponible',
      'unknown': 'Estado desconocido'
    };
    return labels[status] || 'Desconocido';
  }

  private async tryAutoLocate(): Promise<void> {
    const permission = await this.locationService.checkPermission();
    if (permission === 'granted') {
      this.locateMe();
    }
  }

  async locateMe(): Promise<void> {
    this.locationLoading.set(true);

    const location = await this.locationService.getCurrentPosition();

    if (location && this.map) {
      // Update or create user marker
      if (this.userMarker) {
        this.userMarker.setLatLng([location.latitude, location.longitude]);
      } else {
        const userIcon = L.divIcon({
          html: `
            <div class="user-marker">
              <div class="user-marker-dot"></div>
              <div class="user-marker-pulse"></div>
            </div>
          `,
          className: 'user-marker-container',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        this.userMarker = L.marker([location.latitude, location.longitude], { icon: userIcon });
        this.userMarker.addTo(this.map);
      }

      // Center map on user location
      this.map.setView([location.latitude, location.longitude], 14);
    }

    this.locationLoading.set(false);
  }

  onSearch(event: CustomEvent): void {
    const query = event.detail.value || '';
    this.searchQuery.set(query);

    if (query.length >= 2) {
      const results = this.stationsService.searchStations(query);
      if (results.length > 0 && this.map) {
        // Fit bounds to show all results
        const bounds = L.latLngBounds(results.map(s => [s.latitude, s.longitude]));
        this.map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }

  isFilterActive(filter: string): boolean {
    return this.quickFilters().has(filter);
  }

  toggleQuickFilter(filter: string): void {
    const current = new Set(this.quickFilters());

    if (current.has(filter)) {
      current.delete(filter);
    } else {
      current.add(filter);
    }

    this.quickFilters.set(current);
    this.applyQuickFilters();
  }

  private applyQuickFilters(): void {
    const active = this.quickFilters();
    const filters: StationFilters = {};

    if (active.has('rapid')) {
      filters.chargingSpeed = ['rapid', 'ultra'];
    }

    if (active.has('available')) {
      filters.status = ['available'];
    }

    if (active.has('free')) {
      filters.isFree = true;
    }

    this.stationsService.setFilters(filters);
  }

  openFilters(): void {
    this.showFilters.set(true);
  }

  closeFilters(): void {
    this.showFilters.set(false);
  }

  applyFilters(filters: StationFilters): void {
    this.stationsService.setFilters(filters);
    this.closeFilters();
  }

  private countActiveFilters(filters: StationFilters): number {
    let count = 0;
    if (filters.connectorTypes?.length) count++;
    if (filters.operators?.length) count++;
    if (filters.minPowerKw || filters.maxPowerKw) count++;
    if (filters.status?.length) count++;
    if (filters.chargingSpeed?.length) count++;
    if (filters.isFree !== undefined) count++;
    if (filters.is24Hours) count++;
    return count;
  }
}

// Global event listener for popup button clicks
if (typeof window !== 'undefined') {
  window.addEventListener('openStation', ((event: CustomEvent) => {
    const stationId = event.detail;
    // Navigate to station detail
    window.location.href = `/station/${stationId}`;
  }) as EventListener);
}
