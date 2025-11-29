import { Injectable, signal } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { environment } from '@env/environment';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
}

/**
 * Location Service
 *
 * Handles user geolocation using Capacitor Geolocation plugin.
 * Works on both web (via browser API) and native (via Capacitor).
 */
@Injectable({
  providedIn: 'root'
})
export class LocationService {
  // Reactive state
  private locationSignal = signal<UserLocation | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private permissionSignal = signal<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

  // Public readonly signals
  readonly location = this.locationSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly permission = this.permissionSignal.asReadonly();

  // Watch subscription ID
  private watchId: string | null = null;

  constructor() {
    this.checkPermission();
  }

  /**
   * Check current location permission status
   */
  async checkPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    try {
      const status = await Geolocation.checkPermissions();
      const permission = status.location === 'granted' ? 'granted' :
                        status.location === 'denied' ? 'denied' : 'prompt';
      this.permissionSignal.set(permission);
      return permission;
    } catch (error) {
      console.error('Error checking permission:', error);
      this.permissionSignal.set('unknown');
      return 'prompt';
    }
  }

  /**
   * Request location permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      const status = await Geolocation.requestPermissions();
      const granted = status.location === 'granted';
      this.permissionSignal.set(granted ? 'granted' : 'denied');
      return granted;
    } catch (error) {
      console.error('Error requesting permission:', error);
      this.errorSignal.set('No se pudo solicitar permiso de ubicación');
      return false;
    }
  }

  /**
   * Get current position (one-time)
   */
  async getCurrentPosition(): Promise<UserLocation | null> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      // Check/request permission first
      const permission = await this.checkPermission();
      if (permission === 'denied') {
        this.errorSignal.set('Permiso de ubicación denegado');
        return null;
      }

      if (permission === 'prompt') {
        const granted = await this.requestPermission();
        if (!granted) {
          this.errorSignal.set('Permiso de ubicación no concedido');
          return null;
        }
      }

      // Get position
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });

      const userLocation = this.transformPosition(position);

      // Validate that location is in Bogotá area (roughly)
      if (!this.isInBogotaArea(userLocation)) {
        console.warn('Location is outside Bogotá area');
        // Still return the location but log warning
      }

      this.locationSignal.set(userLocation);
      return userLocation;

    } catch (error: any) {
      console.error('Error getting location:', error);
      const errorMessage = this.getErrorMessage(error);
      this.errorSignal.set(errorMessage);
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Start watching position changes
   */
  async startWatching(): Promise<void> {
    if (this.watchId) {
      return; // Already watching
    }

    const permission = await this.checkPermission();
    if (permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    try {
      this.watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000
        },
        (position, error) => {
          if (error) {
            console.error('Watch position error:', error);
            this.errorSignal.set(this.getErrorMessage(error));
            return;
          }

          if (position) {
            const userLocation = this.transformPosition(position);
            this.locationSignal.set(userLocation);
            this.errorSignal.set(null);
          }
        }
      );
    } catch (error) {
      console.error('Error starting watch:', error);
    }
  }

  /**
   * Stop watching position changes
   */
  async stopWatching(): Promise<void> {
    if (this.watchId) {
      await Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

  /**
   * Get default center (Bogotá) when location is unavailable
   */
  getDefaultCenter(): { latitude: number; longitude: number } {
    return {
      latitude: environment.map.defaultCenter.lat,
      longitude: environment.map.defaultCenter.lng
    };
  }

  /**
   * Calculate distance from current location to a point
   */
  getDistanceTo(targetLat: number, targetLng: number): number | null {
    const current = this.locationSignal();
    if (!current) return null;

    return this.calculateDistance(
      current.latitude,
      current.longitude,
      targetLat,
      targetLng
    );
  }

  // =====================
  // Private methods
  // =====================

  private transformPosition(position: Position): UserLocation {
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp)
    };
  }

  private isInBogotaArea(location: UserLocation): boolean {
    const bounds = environment.map.bogotaBounds;
    return (
      location.latitude >= bounds.south &&
      location.latitude <= bounds.north &&
      location.longitude >= bounds.west &&
      location.longitude <= bounds.east
    );
  }

  private getErrorMessage(error: any): string {
    if (error?.code === 1 || error?.message?.includes('denied')) {
      return 'Permiso de ubicación denegado. Por favor habilítalo en configuración.';
    }
    if (error?.code === 2 || error?.message?.includes('unavailable')) {
      return 'Ubicación no disponible. Verifica tu conexión GPS.';
    }
    if (error?.code === 3 || error?.message?.includes('timeout')) {
      return 'Tiempo de espera agotado. Intenta de nuevo.';
    }
    return 'Error al obtener ubicación';
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
