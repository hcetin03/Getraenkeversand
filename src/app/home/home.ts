import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
// Wir importieren 'Wine' hier direkt aus lucide-angular für dein Logo mit// Wir importieren 'Wine' hier direkt aus lucide-angular für dein Logo mit
import { HttpClient } from '@angular/common/http';
import {LucideAngularModule, Wine} from 'lucide-angular';
import { Header } from '../header/header';


type Gutschein = {
  id: number;
  code: string;
  beschreibung: string;
  rabatt_betrag: string;
  max_nutzungen_pro_kunde: number;
  gueltig_bis: string;
  bereits_genutzt: number;
  mindestbestellwert: number;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    Header
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  // Das macht die cleane Flasche für dein Logo im HTML verfügbar!
  readonly LogoFlasche = Wine;

  logoPath = 'images/homelogo.PNG';

  // Deine Icons für die Kategorieleiste unten drunter
  WasserIcon = 'droplet';
  LimoIcon = 'cup-soda';
  BierIcon = 'beer';
  MilchIcon = 'glass-water';
  WeinIcon = 'wine';
  KaffeeIcon = 'coffee';

  kundeIstEingeloggt = false;

  gutschein: Gutschein | null = null;
  gutscheinVorhanden = true;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
  this.gutscheinLaden();
  }


  gutscheinLaden(): void {
  const kundeId = localStorage.getItem('kundeId');

  this.kundeIstEingeloggt = kundeId !== null;

  if (!kundeId) {
    return;
  }

  this.http.get<Gutschein>(`http://localhost:3000/api/gutschein/${kundeId}`)
    .subscribe({
      next: (daten) => {
        this.gutschein = daten;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Fehler beim Laden des Gutscheins:', err)
    });
}

gutscheinEinloesen(): void {
  if (!this.gutschein) return;

  localStorage.setItem('aktiverGutscheinCode', this.gutschein.code);
  localStorage.setItem('aktiverGutscheinBetrag', this.gutschein.rabatt_betrag);
  localStorage.setItem('aktiverGutscheinMindestwert', this.gutschein.mindestbestellwert.toString());

  alert(`Gutschein "${this.gutschein.code}" wird bei deiner nächsten Bestellung im Warenkorb automatisch angewendet, sobald der Mindestbestellwert erreicht ist!`);
}

  @ViewChild('brandSlider')
  brandSlider!: ElementRef;

  scrollSlider(distance: number): void {
    if (this.brandSlider) {
      this.brandSlider.nativeElement.scrollLeft += distance;
    }
  }
}