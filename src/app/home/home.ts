import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // 1. Deine Icon-Variablen
  WasserIcon = 'droplet';
  LimoIcon = 'cup-soda';
  BierIcon = 'beer';
  MilchIcon = 'glass-water';
  WeinIcon = 'wine';
  KaffeeIcon = 'coffee';

  // 2. Greift auf das #brandSlider Element aus dem HTML zu (jetzt RICHTIG innerhalb der Klasse)
  @ViewChild('brandSlider') brandSlider!: ElementRef;

  // 3. Die Scroll-Funktion für die Pfeile
  scrollSlider(distance: number) {
    if (this.brandSlider) {
      // Bewegt den Scrollbalken um den übergebenen Wert (z.B. +200px oder -200px)
      this.brandSlider.nativeElement.scrollLeft += distance;
    }
  }
} // <-- Hier schließt sich die Klasse jetzt erst ganz am Ende!