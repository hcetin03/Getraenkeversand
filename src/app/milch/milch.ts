import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-milch',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Header],
  templateUrl: './milch.html',
  styleUrl: './milch.css',
})
export class Milch {}