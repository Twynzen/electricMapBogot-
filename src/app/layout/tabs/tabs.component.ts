import { Component } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="map">
          <ion-icon name="map-outline"></ion-icon>
          <ion-label>Mapa</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="list">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>Lista</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="news">
          <ion-icon name="newspaper-outline"></ion-icon>
          <ion-label>Noticias</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="about">
          <ion-icon name="information-circle-outline"></ion-icon>
          <ion-label>Info</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [`
    ion-tab-bar {
      --background: var(--ion-background-color);
      border-top: 1px solid var(--ion-color-light-shade);
    }

    ion-tab-button {
      --color: var(--ion-color-medium);
      --color-selected: var(--ion-color-primary);
    }

    ion-label {
      font-size: 11px;
      font-weight: 500;
    }
  `]
})
export class TabsComponent {}
