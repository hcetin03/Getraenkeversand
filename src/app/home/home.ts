import { Component } from '@angular/core';
<<<<<<< HEAD

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
=======
import { RouterLink, RouterLinkActive } from '@angular/router';
// 1. Importiere das Lucide-Modul für Angular hier oben
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  // 2. Füge das Modul hier unbedingt zu den imports hinzu!
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // 3. Definiere die exakt gleichen Icon-Variablen als Strings wie in deiner bier.ts
  WasserIcon = 'droplet';
  LimoIcon = 'cup-soda';
  BierIcon = 'beer';
  MilchIcon = 'glass-water';
  WeinIcon = 'wine';
  KaffeeIcon = 'coffee';
}
>>>>>>> caa384637f35fc40decf2234f5875c663186d562
