import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-lieferstatus',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive, 
    Header
  ],
  templateUrl: './lieferstatus.html',
  styleUrl: './lieferstatus.css'
})
export class Lieferstatus {
  schritte = [
    { id: 1, titel: 'Bestellt' },
    { id: 2, titel: 'In Bearbeitung' },
    { id: 3, titel: 'Versandt' },
    { id: 4, titel: 'Zugestellt' }
  ];

  aktuellerStatusId = 1; // Start bei Schritt 1

  naechsterSchritt() {
    if (this.aktuellerStatusId < this.schritte.length) {
      this.aktuellerStatusId++;
    } else {
      this.aktuellerStatusId = 1; // Fängt wieder von vorne an
    }
  }
}