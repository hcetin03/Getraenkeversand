import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';
// Wir importieren 'Wine' hier direkt aus lucide-angular für dein Logo mit// Wir importieren 'Wine' hier direkt aus lucide-angular für dein Logo mit
import { HttpClient } from '@angular/common/http';
import {LucideAngularModule, Wine} from 'lucide-angular';
import { Header } from '../header/header';


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
export class Home {

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

  @ViewChild('brandSlider')
  brandSlider!: ElementRef;

  scrollSlider(distance: number): void {
    if (this.brandSlider) {
      this.brandSlider.nativeElement.scrollLeft += distance;
    }
  }
}