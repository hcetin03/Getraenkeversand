import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink, RouterLinkActive } from '@angular/router';
// Wir importieren 'Wine' hier direkt aus lucide-angular für dein Logo mit
import { LucideAngularModule, Wine } from 'lucide-angular';
import { Header } from '../header/header';

@Component({
  selector: 'app-favoriten',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, Header], 
  templateUrl: './favoriten.html',
  styleUrl: './favoriten.css',
})
export class Favoriten {
  // Beispiel-Datenstruktur für deine Boards, die du später erweitern kannst
  boards = [
    {
      title: 'Favoriten',
      count: '341 Artikel',
      isFavoriteStyle: true,
      isPrivate: false,
      mainImg: '', // Pfad zu einem Produktbild
      sideImages: ['assets/volvic-zitrone.jpg', 'assets/cola-dose.jpg', 'assets/bier-flasche.jpg']
    },
    {
      title: 'Zuletzt gekaufte Artikel',
      count: '24 Artikel',
      isFavoriteStyle: false,
      isPrivate: false,
      mainImg: 'assets/kiste-wasser.jpg',
      sideImages: ['assets/saft-packung.jpg', 'assets/limo-flasche.jpg', 'assets/regio-bier.jpg']
    },
    {
      title: 'Geburtstags-Party',
      count: 'Dein privates Board',
      isFavoriteStyle: false,
      isPrivate: true,
      mainImg: 'assets/wein-flasche.jpg',
      sideImages: ['', '', '']
    }
  ];
}
