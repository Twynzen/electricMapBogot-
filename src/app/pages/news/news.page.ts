import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonNote
} from '@ionic/angular/standalone';
import { NewsItem, getNewsTypeLabel, getNewsTypeIcon, getNewsTypeColor } from '../../models/news.model';

@Component({
  selector: 'app-news',
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
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonNote
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Noticias</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Coming soon placeholder -->
      <div class="coming-soon">
        <ion-icon name="newspaper-outline"></ion-icon>
        <h2>Noticias y Alertas</h2>
        <p>Próximamente podrás ver noticias sobre:</p>
        <ul>
          <li>Nuevas estaciones de carga</li>
          <li>Cambios de precios</li>
          <li>Alertas de fallas</li>
          <li>Promociones especiales</li>
          <li>Cambios en regulación</li>
        </ul>
      </div>

      <!-- Sample news items (placeholder) -->
      <div class="sample-news">
        <h3 class="section-title">Últimas novedades</h3>

        @for (item of sampleNews(); track item.id) {
          <ion-card>
            <ion-card-header>
              <div class="news-header">
                <ion-badge [color]="getNewsTypeColor(item.type)">
                  <ion-icon [name]="getNewsTypeIcon(item.type)"></ion-icon>
                  {{ getNewsTypeLabel(item.type) }}
                </ion-badge>
                <ion-note>{{ item.publishedAt | date:'shortDate':'':'es' }}</ion-note>
              </div>
              <ion-card-title>{{ item.title }}</ion-card-title>
              @if (item.stationName) {
                <ion-card-subtitle>
                  <ion-icon name="location-outline"></ion-icon>
                  {{ item.stationName }}
                </ion-card-subtitle>
              }
            </ion-card-header>
            <ion-card-content>
              <p>{{ item.summary }}</p>
            </ion-card-content>
          </ion-card>
        }
      </div>

      <div class="footer-note">
        <ion-note>
          Esta sección se activará cuando conectes Supabase.
          Las noticias se alimentarán automáticamente.
        </ion-note>
      </div>
    </ion-content>
  `,
  styles: [`
    .coming-soon {
      padding: 32px 24px;
      text-align: center;
      background: linear-gradient(180deg, var(--ion-color-primary-tint) 0%, transparent 100%);
      color: var(--ion-color-dark);

      ion-icon {
        font-size: 64px;
        color: var(--ion-color-primary);
        margin-bottom: 16px;
      }

      h2 {
        margin: 0 0 8px;
        font-size: 24px;
        font-weight: 600;
      }

      p {
        margin: 0 0 16px;
        color: var(--ion-color-medium);
      }

      ul {
        text-align: left;
        max-width: 280px;
        margin: 0 auto;
        padding-left: 20px;

        li {
          margin: 8px 0;
          color: var(--ion-color-dark);
        }
      }
    }

    .sample-news {
      padding: 16px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--ion-color-medium);
      margin: 0 0 12px;
    }

    ion-card {
      margin: 0 0 12px;
    }

    .news-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    ion-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      padding: 4px 8px;
    }

    ion-card-title {
      font-size: 16px;
      font-weight: 600;
    }

    ion-card-subtitle {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
    }

    ion-card-content p {
      margin: 0;
      color: var(--ion-color-medium-shade);
    }

    .footer-note {
      padding: 24px;
      text-align: center;

      ion-note {
        font-size: 12px;
      }
    }
  `]
})
export class NewsPage implements OnInit {
  sampleNews = signal<NewsItem[]>([]);

  // Re-export helper functions
  getNewsTypeLabel = getNewsTypeLabel;
  getNewsTypeIcon = getNewsTypeIcon;
  getNewsTypeColor = getNewsTypeColor;

  ngOnInit(): void {
    // Load sample news for demonstration
    this.loadSampleNews();
  }

  loadSampleNews(): void {
    const samples: NewsItem[] = [
      {
        id: '1',
        title: 'Nueva estación de carga rápida en Unicentro',
        summary: 'Enel X inauguró 2 nuevos puntos de carga CCS2 de 50 kW en el Centro Comercial Unicentro.',
        type: 'new_station',
        priority: 'medium',
        stationName: 'Enel X - Unicentro',
        publishedAt: new Date('2025-11-15'),
        createdAt: new Date(),
        isActive: true
      },
      {
        id: '2',
        title: 'Actualización de precios en estaciones Terpel Voltex',
        summary: 'Terpel Voltex ajustó sus tarifas de carga DC a $1,450/kWh a partir de noviembre 2025.',
        type: 'price',
        priority: 'high',
        operatorName: 'Terpel Voltex',
        publishedAt: new Date('2025-11-10'),
        createdAt: new Date(),
        isActive: true
      },
      {
        id: '3',
        title: 'Estación Portal Norte fuera de servicio temporalmente',
        summary: 'La estación de carga en Portal Norte estará en mantenimiento del 20 al 22 de noviembre.',
        type: 'outage',
        priority: 'high',
        stationName: 'Enel X - Portal Norte',
        publishedAt: new Date('2025-11-18'),
        createdAt: new Date(),
        isActive: true
      },
      {
        id: '4',
        title: 'Resolución 40559: Nuevos estándares de conectores',
        summary: 'El Ministerio de Minas estableció Type 2 y CCS2 como estándares obligatorios para nuevas estaciones.',
        type: 'regulation',
        priority: 'medium',
        publishedAt: new Date('2025-11-05'),
        createdAt: new Date(),
        isActive: true
      }
    ];

    this.sampleNews.set(samples);
  }

  async doRefresh(event: CustomEvent): Promise<void> {
    // In a real app, this would fetch from Supabase
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.loadSampleNews();
    (event.target as any).complete();
  }
}
