import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bier',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bier.html',
  styleUrl: './bier.css',
})
export class Bier {}