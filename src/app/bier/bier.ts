import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // Importieren!

@Component({
  selector: 'app-bier',
  standalone: true,
  imports: [RouterLink], // Hier eintragen!
  templateUrl: './bier.html',
  styleUrl: './bier.css',
})
export class Bier {}