import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonNote
} from '@ionic/angular/standalone';
import { environment } from '@env/environment';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonNote
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Acerca de</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- App info -->
      <div class="app-header">
        <div class="app-icon">
          <ion-icon name="flash"></ion-icon>
        </div>
        <h1>ElectricMap Bogotá</h1>
        <p class="version">Versión {{ version }}</p>
        <p class="tagline">Tu guía de estaciones de carga para vehículos eléctricos en Bogotá</p>
      </div>

      <!-- Stats card -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            <ion-icon name="stats-chart-outline"></ion-icon>
            Estadísticas
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">20+</span>
              <span class="stat-label">Estaciones</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">6</span>
              <span class="stat-label">Operadores</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">50+</span>
              <span class="stat-label">Conectores</span>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Features -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            <ion-icon name="star-outline"></ion-icon>
            Características
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item>
              <ion-icon name="map-outline" slot="start" color="primary"></ion-icon>
              <ion-label>
                <h3>Mapa interactivo</h3>
                <p>Encuentra estaciones cerca de ti</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-icon name="filter-outline" slot="start" color="primary"></ion-icon>
              <ion-label>
                <h3>Filtros avanzados</h3>
                <p>Por conector, potencia y operador</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-icon name="navigate-outline" slot="start" color="primary"></ion-icon>
              <ion-label>
                <h3>Navegación GPS</h3>
                <p>Integración con Google Maps</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-icon name="pricetag-outline" slot="start" color="primary"></ion-icon>
              <ion-label>
                <h3>Información de precios</h3>
                <p>Tarifas actualizadas por operador</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Data sources -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            <ion-icon name="server-outline"></ion-icon>
            Fuentes de datos
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item>
              <ion-label>
                <h3>OpenChargeMap</h3>
                <p>Base de datos global de estaciones</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h3>Operadores locales</h3>
                <p>Enel X, Celsia, Terpel Voltex</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h3>Verificación manual</h3>
                <p>Datos validados en campo</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Contact -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            <ion-icon name="mail-outline"></ion-icon>
            Contacto
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>¿Encontraste un error en los datos? ¿Conoces una estación que no está listada?</p>
          <ion-button expand="block" fill="outline" class="contact-button">
            <ion-icon name="chatbubble-outline" slot="start"></ion-icon>
            Reportar problema
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Legal -->
      <div class="legal-section">
        <ion-note>
          ElectricMap Bogotá es un proyecto independiente.
          Los datos son proporcionados "tal cual" sin garantías.
          Los precios y disponibilidad pueden variar.
        </ion-note>
        <ion-note>
          © 2025 ElectricMap Bogotá. Todos los derechos reservados.
        </ion-note>
      </div>
    </ion-content>
  `,
  styles: [`
    .app-header {
      text-align: center;
      padding: 32px 24px;
      background: linear-gradient(180deg, var(--ion-color-primary) 0%, var(--ion-color-primary-shade) 100%);
      color: #fff;
    }

    .app-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 16px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      ion-icon {
        font-size: 48px;
      }
    }

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }

    .version {
      margin: 4px 0 8px;
      opacity: 0.8;
      font-size: 14px;
    }

    .tagline {
      margin: 0;
      font-size: 14px;
      opacity: 0.9;
    }

    ion-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
    }

    .stats-grid {
      display: flex;
      justify-content: space-around;
      text-align: center;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--ion-color-primary);
    }

    .stat-label {
      font-size: 12px;
      color: var(--ion-color-medium);
      text-transform: uppercase;
    }

    ion-list {
      padding: 0;
      background: transparent;
    }

    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
      --background: transparent;

      h3 {
        font-weight: 600;
        margin: 0 0 2px;
      }

      p {
        margin: 0;
        font-size: 13px;
      }
    }

    .contact-button {
      margin-top: 12px;
    }

    .legal-section {
      padding: 24px;
      text-align: center;

      ion-note {
        display: block;
        font-size: 11px;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
          margin-top: 16px;
        }
      }
    }
  `]
})
export class AboutPage {
  version = environment.app.version;
}
