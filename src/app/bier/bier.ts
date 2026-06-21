import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-bier',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Header],
  templateUrl: './bier.html',
  styleUrl: './bier.css',
})
export class Bier {}
