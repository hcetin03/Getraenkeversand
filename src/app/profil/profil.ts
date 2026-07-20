import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../header/header';

type Kunde = {
  id: number;
  vorname: string;
  nachname: string;
  email: string;
  adresse?: string;
  plz?: string;
  wohnort?: string;
  telefon?: string;
};

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [Header, RouterLink],
  templateUrl: './profil.html',
  styleUrl: './profil.css'
})
export class Profil implements OnInit {

  kunde: Kunde | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.kunde = JSON.parse(
      localStorage.getItem('kunde') || 'null'
    );

    if (!this.kunde) {
      this.router.navigate(['/login']);
    }
  }
}